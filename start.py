#!/usr/bin/env python3
"""Launch NoorCast locally on any OS.

Why: browsers block getUserMedia / Web Bluetooth on file:// URLs. This serves
the folder over http://localhost so camera, mic and micro:bit BLE work.

Usage: double-click, or `python start.py` (or `python3 start.py`).
"""
import http.server
import os
import socket
import socketserver
import sys
import threading
import webbrowser

PREFERRED_PORT = 8765


def pick_port(start: int) -> int:
    """Return the first free port >= start (falls back to OS-assigned)."""
    for p in range(start, start + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", p)) != 0:
                return p
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def main() -> None:
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = pick_port(PREFERRED_PORT)
    url = f"http://localhost:{port}/index.html"

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        print(f"NoorCast serving at {url}")
        print("Press Ctrl+C to stop.")
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
            sys.exit(0)


if __name__ == "__main__":
    main()
