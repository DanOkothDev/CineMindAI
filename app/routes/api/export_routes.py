import io
import json
import re
import textwrap
from datetime import datetime

from flask import Response
from app.routes.api import api
from app.utils.exceptions import BadRequestError, NotFoundError
from app.utils.response import error_response
from app.services.project_service import ProjectService


project_service = ProjectService()


def _get_full_or_404(project_id):
    result = project_service.get_full_project(project_id)
    if result["status"] != "success":
        raise NotFoundError("Project not found")
    return result["data"]


# ---------------------------------------------------------------------------
# JSON
# ---------------------------------------------------------------------------

@api.route("/project/<int:project_id>/export/json", methods=["GET"])
def export_json(project_id):
    data = _get_full_or_404(project_id)
    blob = json.dumps(data, indent=2, ensure_ascii=False).encode("utf-8")
    title_slug = _slugify(data["project"].get("title", f"project-{project_id}"))
    return Response(
        blob,
        status=200,
        mimetype="application/json",
        headers={"Content-Disposition": f'attachment; filename="{title_slug}.json"'},
    )


# ---------------------------------------------------------------------------
# PDF  (plain-text formatted, no external library required)
# ---------------------------------------------------------------------------

@api.route("/project/<int:project_id>/export/pdf", methods=["GET"])
def export_pdf(project_id):
    data = _get_full_or_404(project_id)
    try:
        blob = _build_pdf(data)
    except Exception as exc:
        return error_response(f"PDF generation failed: {exc}", 500)

    title_slug = _slugify(data["project"].get("title", f"project-{project_id}"))
    return Response(
        blob,
        status=200,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{title_slug}.pdf"',
            "Cache-Control": "no-store",
        },
    )


# ---------------------------------------------------------------------------
# Final Draft (.fdx)
# ---------------------------------------------------------------------------

@api.route("/project/<int:project_id>/export/finaldraft", methods=["GET"])
def export_finaldraft(project_id):
    data = _get_full_or_404(project_id)
    xml = _build_fdx(data)
    title_slug = _slugify(data["project"].get("title", f"project-{project_id}"))
    return Response(
        xml.encode("utf-8"),
        status=200,
        mimetype="application/xml",
        headers={"Content-Disposition": f'attachment; filename="{title_slug}.fdx"'},
    )


# ---------------------------------------------------------------------------
# Video  (not yet implemented)
# ---------------------------------------------------------------------------

@api.route("/project/<int:project_id>/export/video", methods=["GET"])
def export_video(project_id):
    return error_response("Video export is not yet available.", 501)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _slugify(value: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "cinemindai-project"


def _wrap(text: str, width: int = 80) -> str:
    if not text:
        return ""
    return "\n".join(textwrap.wrap(text, width))


# ---- PDF builder (pure-Python, uses fpdf2 if available, else plaintext PDF) ----

def _build_pdf(data: dict) -> bytes:
    try:
        from fpdf import FPDF  # type: ignore
        return _build_pdf_fpdf(data)
    except ImportError:
        return _build_pdf_plaintext(data)


def _build_pdf_plaintext(data: dict) -> bytes:
    """
    Generates a minimal but valid PDF containing the script as plain text,
    with no external dependencies beyond the standard library.
    """
    lines = _script_lines(data)
    safe_lines = []
    for raw_line in lines:
        cleaned = _clean_markdown_text(raw_line)
        if not cleaned:
            safe_lines.append("")
            continue
        wrapped = textwrap.wrap(
            cleaned,
            width=92,
            break_long_words=False,
            break_on_hyphens=False,
        ) or [""]
        safe_lines.extend(wrapped)

    buf = io.BytesIO()
    objects = []

    def add_obj(content: str) -> int:
        objects.append(content)
        return len(objects)

    add_obj("")
    add_obj("")

    page_ids = []
    page_lines = []
    max_lines_per_page = 48
    for line in safe_lines:
        page_lines.append(line)
        if len(page_lines) >= max_lines_per_page:
            page_ids.append(_build_pdf_page_object(objects, add_obj, page_lines))
            page_lines = []
    if page_lines or not page_ids:
        page_ids.append(_build_pdf_page_object(objects, add_obj, page_lines or [""]))

    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    objects[1] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>"
    objects[0] = f"<< /Type /Catalog /Pages 2 0 R >>"

    header = b"%PDF-1.4\n"
    buf.write(header)
    offsets = []
    for i, obj_content in enumerate(objects, start=1):
        offsets.append(buf.tell())
        entry = f"{i} 0 obj\n{obj_content}\nendobj\n"
        buf.write(entry.encode("latin-1", errors="replace"))

    xref_offset = buf.tell()
    buf.write(f"xref\n0 {len(objects) + 1}\n".encode())
    buf.write(b"0000000000 65535 f \n")
    for off in offsets:
        buf.write(f"{off:010d} 00000 n \n".encode())

    buf.write(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n".encode()
    )
    return buf.getvalue()


def _build_pdf_page_object(objects: list[str], add_obj, lines: list[str]) -> int:
    content_lines = [
        "BT",
        "/F1 9 Tf",
        "72 740 Td",
        "11 TL",
    ]
    for line in lines:
        escaped_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        content_lines.append(f"({escaped_line}) Tj")
        content_lines.append("T*")
    content_lines.append("ET")
    stream = "\n".join(content_lines)
    stream_bytes = stream.encode("latin-1", errors="replace")
    content_id = add_obj(
        f"<< /Length {len(stream_bytes)} >>\nstream\n"
        + stream_bytes.decode("latin-1")
        + "\nendstream"
    )
    return add_obj(
        f"<< /Type /Page /Parent 2 0 R "
        f"/MediaBox [0 0 612 792] "
        f"/Contents {content_id} 0 R "
        f"/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> >> >> "
        f">>"
    )


def _clean_markdown_text(text: str) -> str:
    if not text:
        return ""
    value = str(text)
    value = re.sub(r"```.*?```", "", value, flags=re.S)
    value = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"(?<!\*)\*\*(.+?)\*\*(?!\*)", r"\1", value)
    value = re.sub(r"(?<!\*)\*(.+?)\*(?!\*)", r"\1", value)
    value = re.sub(r"(?<!_)__(.+?)__(?!_)", r"\1", value)
    value = re.sub(r"(?<!_)_(.+?)_(?!_)", r"\1", value)
    value = re.sub(r"`([^`]+)`", r"\1", value)
    value = re.sub(r"^\s{0,3}#{1,6}\s*", "", value)
    value = re.sub(r"^\s*[-*+]\s+", "", value)
    value = re.sub(r"^\s*\d+\.\s+", "", value)
    value = value.replace("\t", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def _build_pdf_fpdf(data: dict) -> bytes:
    from fpdf import FPDF  # type: ignore

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(25, 20, 25)
    pdf.add_page()
    pdf.set_font("Courier", size=12)

    for line in _script_lines(data):
        if line.startswith("==="):
            pdf.set_font("Courier", style="B", size=13)
            pdf.cell(0, 10, line, ln=True)
            pdf.set_font("Courier", size=10)
        elif line.startswith("---"):
            pdf.set_font("Courier", style="B", size=11)
            pdf.cell(0, 8, line, ln=True)
            pdf.set_font("Courier", size=10)
        elif line == "":
            pdf.ln(4)
        else:
            pdf.multi_cell(0, 6, line)

    return pdf.output()


def _script_lines(data: dict) -> list[str]:
    """Produces a flat list of text lines representing the full screenplay."""
    project = data.get("project", {})
    story = data.get("story") or {}
    characters = data.get("characters", [])
    scenes = data.get("scenes", [])
    dialogues = data.get("dialogues", [])

    lines = []

    def h1(t):
        lines.append("")
        lines.append("=" * 70)
        lines.append(t.upper())
        lines.append("=" * 70)

    def h2(t):
        lines.append("")
        lines.append("-" * 50)
        lines.append(t)
        lines.append("-" * 50)

    def para(t):
        if t:
            for wrapped in textwrap.wrap(str(t), 70):
                lines.append(wrapped)

    # Title page
    title = project.get("title", "Untitled")
    lines.append(title.upper())
    lines.append("")
    lines.append(f"Genre: {project.get('genre', '—')}")
    lines.append(f"Exported: {datetime.utcnow().strftime('%Y-%m-%d')}")
    if story.get("logline"):
        lines.append("")
        para(story["logline"])

    # Story
    structure = story.get("structure", {})
    themes = story.get("themes", [])
    if structure or themes:
        h1("Story")
        for act_key, act_label in [
            ("act_1", "ACT ONE — SETUP"),
            ("act_2", "ACT TWO — CONFRONTATION"),
            ("act_3", "ACT THREE — RESOLUTION"),
        ]:
            text = (
                structure.get(act_key)
                or story.get(act_key.replace("_1", "_one").replace("_2", "_two").replace("_3", "_three"))
            )
            if text:
                h2(act_label)
                para(text)
        if themes:
            lines.append("")
            lines.append(f"THEMES: {', '.join(themes)}")

    # Characters
    if characters:
        h1("Characters")
        for c in characters:
            lines.append("")
            lines.append(f"{c.get('name', 'Unknown').upper()}  —  {c.get('role', '')}")
            if c.get("personality"):
                para(c["personality"])
            if c.get("motivation"):
                lines.append(f"Motivation: {c['motivation']}")

    # Scenes + Dialogue
    if scenes:
        h1("Screenplay")
        scene_map = {s["id"]: s for s in scenes}
        dialogue_by_scene: dict = {}
        for d in dialogues:
            sid = d.get("scene_id")
            if sid is not None:
                dialogue_by_scene.setdefault(sid, []).append(d)
            else:
                stitle = (d.get("scene_title") or "").strip().lower()
                dialogue_by_scene.setdefault(f"title:{stitle}", []).append(d)
    
        def _fdx_scene_dialogues(scene):
            by_id = dialogue_by_scene.get(scene["id"], [])
            if by_id:
                return by_id
            stitle = (scene.get("title") or "").strip().lower()
            return dialogue_by_scene.get(f"title:{stitle}", [])

        for scene in scenes:
            lines.append("")
            loc = scene.get("location") or scene.get("title", "")
            lines.append(f"INT./EXT. {loc.upper()} — {scene.get('mood', '').upper()}")
            if scene.get("description"):
                lines.append("")
                para(scene["description"])
            for d in _fdx_scene_dialogues(scene):
                lines.append("")
                lines.append(f"                    {d.get('character', '').upper()}")
                if d.get("emotion"):
                    lines.append(f"                    ({d['emotion']})")
                lines.append(f"          {d.get('line', '')}")

    lines.append("")
    lines.append("— END —")
    return lines


# ---- FDX builder ----

def _build_fdx(data: dict) -> str:
    project = data.get("project", {})
    story = data.get("story") or {}
    scenes = data.get("scenes", [])
    dialogues = data.get("dialogues", [])

    structure = story.get("structure", {})
    title = project.get("title", "Untitled")

    dialogue_by_scene: dict = {}
    for d in dialogues:
        sid = d.get("scene_id")
        if sid is not None:
            dialogue_by_scene.setdefault(sid, []).append(d)
        else:
            stitle = (d.get("scene_title") or "").strip().lower()
            dialogue_by_scene.setdefault(f"title:{stitle}", []).append(d)

    def _get_scene_dialogues(scene):
        by_id = dialogue_by_scene.get(scene["id"], [])
        if by_id:
            return by_id
        stitle = (scene.get("title") or "").strip().lower()
        return dialogue_by_scene.get(f"title:{stitle}", [])

    def esc(t: str) -> str:
        return (
            str(t)
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )

    parts = []
    parts.append('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>')
    parts.append('<FinalDraft DocumentType="Script" Template="No" Version="2">')
    parts.append("<Content>")

    def para_el(ptype: str, text: str) -> str:
        return f'<Paragraph Type="{ptype}"><Text>{esc(text)}</Text></Paragraph>'

    # Title / logline as Action blocks
    parts.append(para_el("Action", title.upper()))
    if story.get("logline"):
        parts.append(para_el("Action", story["logline"]))
    parts.append(para_el("Action", ""))

    # Three-act synopsis as Action
    for act_key, act_label in [
        ("act_1", "ACT ONE"),
        ("act_2", "ACT TWO"),
        ("act_3", "ACT THREE"),
    ]:
        text = structure.get(act_key)
        if text:
            parts.append(para_el("Action", f"--- {act_label} ---"))
            # Wrap long act text into multiple Action paragraphs
            for chunk in textwrap.wrap(text, 80):
                parts.append(para_el("Action", chunk))
            parts.append(para_el("Action", ""))

    # Scenes + dialogue
    for scene in scenes:
        loc = scene.get("location") or scene.get("title", "Scene")
        mood = scene.get("mood", "")
        heading = f"INT./EXT. {loc.upper()} - {mood.upper()}" if mood else f"INT./EXT. {loc.upper()}"
        parts.append(para_el("Scene Heading", heading))

        if scene.get("description"):
            parts.append(para_el("Action", scene["description"]))

        for d in _get_scene_dialogues(scene):
            parts.append(para_el("Character", d.get("character", "").upper()))
            if d.get("emotion"):
                parts.append(para_el("Parenthetical", f"({d['emotion']})"))
            parts.append(para_el("Dialogue", d.get("line", "")))

    parts.append("</Content>")
    parts.append("</FinalDraft>")
    return "\n".join(parts)
