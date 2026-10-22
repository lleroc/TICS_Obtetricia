from pathlib import Path
from html.parser import HTMLParser
root = Path(__file__).parent
class Verify(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.anchors = [], []
        self.topics = self.videos = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('href', '').startswith('#'):
            self.anchors.append(attrs['href'][1:])
        if tag == 'details':
            self.topics += 1
        if tag == 'iframe':
            self.videos += 1
            assert attrs.get('title'), 'Video sin título'
        if tag == 'img':
            assert attrs.get('alt'), 'Imagen sin descripción'
            assert (root / attrs['src']).is_file(), 'Imagen ausente'
page = Verify()
page.feed((root / 'index.html').read_text())
assert page.topics == 16 and page.videos == 4
assert len(page.ids) == len(set(page.ids)), 'Identificadores duplicados'
assert set(page.anchors) <= set(page.ids), 'Enlace interno sin destino'
print('Correcto: 16 temas, 4 videos, imágenes y enlaces internos.')
