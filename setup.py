import os
from datetime import datetime
import json
import re


outoutJSON = ""
FILE_LIST = []
FILE_METADATA = {}
STACK = []
# regexes
_JSON_LD_RE = re.compile(r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>', re.IGNORECASE | re.DOTALL)
_H1_RE = re.compile(r'<h1[^>]*>(.*?)</h1>', re.IGNORECASE | re.DOTALL)
_FIRST_P_RE = re.compile(r'<article[^>]*>.*?<p[^>]*>(.*?)</p>', re.IGNORECASE | re.DOTALL)

def read_dirs(dir):
    STACK.append(dir)
    for i in os.listdir("/".join(STACK)):
        if i.endswith(".html"):
            STACK.append(i)
            FILE_LIST.append("/".join(STACK))
            STACK.pop()
        else :
            read_dirs(i)
    STACK.pop()


def _clean_json_ld(raw: str) -> str:
    cleaned = re.sub(r',\s*([}\]])', r'\1', raw)
    return cleaned

def extract_metadata_from_string(html: str) -> dict:
    result = {"jsonld": None, "h1": None, "excerpt": None}

    m_json = _JSON_LD_RE.search(html)
    if m_json:
        raw = m_json.group(1).strip()
        try:
            result["jsonld"] = json.loads(raw)
        except json.JSONDecodeError:
            try:
                result["jsonld"] = json.loads(_clean_json_ld(raw))
            except Exception:
                result["jsonld_error"] = "failed to parse JSON-LD"

    m_h1 = _H1_RE.search(html)
    if m_h1:
        title = re.sub(r'\s+', ' ', m_h1.group(1)).strip()
        result["h1"] = title

    m_p = _FIRST_P_RE.search(html)
    if m_p:
        excerpt = re.sub(r'\s+', ' ', m_p.group(1)).strip()
        result["excerpt"] = excerpt

    if result.get("jsonld") and result["jsonld"] is not None:
        if not result["jsonld"].get("headline") and result["h1"]:
            result["jsonld"]["headline"] = result["h1"]

    return result

def metadata_maker() :
    for i in FILE_LIST:
        # print(i, os.path.getsize(i), datetime.fromtimestamp(os.path.getmtime(i)))
        # filedir = i
        file_text = ""
        with open(i, "r", encoding='utf-8') as blob:
            for line in blob:
                # print(line, end="")
                file_text = file_text + line
        # print(file_text)
        dict = extract_metadata_from_string(file_text)
        # print(dict)
        # Fixing dict to a more readable format
        data = {}
        for j in dict['jsonld']:
            data[j] = dict['jsonld'][j]
        # set the final metadata
        data['excerpt'] = dict['excerpt']
        FILE_METADATA[i] = data

def store_file_list_to_json(data, file):
    with open(file, "w", encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    read_dirs("./posts")
    metadata_maker()
    store_file_list_to_json(FILE_METADATA, "./auto/posts.json")