#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app import create_app

# Create Flask app
app = create_app()

if __name__ == '__main__':
    # For development
    app.run(debug=True, host='0.0.0.0', port=5000)