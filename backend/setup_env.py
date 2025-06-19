#!/usr/bin/env python3
"""
Setup script to configure environment variables for the CartonCaps Chat POC.
"""

import os
from pathlib import Path

def setup_environment():
    """Set up environment variables for the application."""
    
    # Check if .env file exists
    env_file = Path(".env")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return
    
    # Create .env file with template
    env_content = """# OpenAI API Configuration
# Replace 'your_openai_api_key_here' with your actual OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///./cartoncaps.sqlite
"""
    
    with open(env_file, "w") as f:
        f.write(env_content)
    
    print("✅ Created .env file")
    print("⚠️  Please edit .env file and replace 'your_openai_api_key_here' with your actual OpenAI API key")
    print("   You can get an API key from: https://platform.openai.com/api-keys")

if __name__ == "__main__":
    setup_environment() 