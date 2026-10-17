"""Local preview with HTTP byte ranges for scroll-scrubbed video."""
import http.server
import os
import re
from pathlib import Path

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent / 'dist'), **kwargs)
    def send_head(self):
        path = self.translate_path(self.path)
        range_header = self.headers.get('Range')
        if not range_header or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', range_header)
        if not match:
            self.send_error(416)
            return None
        first, last = match.groups()
        start = int(first) if first else max(0, size - int(last or size))
        end = min(int(last), size - 1) if first and last else size - 1
        if start >= size or start > end:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.end_headers()
            return None
        stream = open(path, 'rb')
        stream.seek(start)
        self.range_remaining = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(self.range_remaining))
        self.end_headers()
        return stream
    def copyfile(self, source, outputfile):
        remaining = getattr(self, 'range_remaining', None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        try:
            while remaining:
                data = source.read(min(65536, remaining))
                if not data:
                    break
                outputfile.write(data)
                remaining -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            del self.range_remaining

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 4174), Handler)
    print('http://127.0.0.1:4174', flush=True)
    server.serve_forever()
