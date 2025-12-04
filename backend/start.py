#!/usr/bin/env python3
"""
Quick start script for Traffic Violation Detection System Backend
"""

import asyncio
import sys
import os
from pathlib import Path

def check_requirements():
    """Check if all requirements are met"""
    print("🔍 Checking requirements...")
    
    # Check if .env file exists
    if not Path(".env").exists():
        print("❌ .env file not found!")
        print("📝 Creating .env file from .env.example...")
        if Path(".env.example").exists():
            import shutil
            shutil.copy(".env.example", ".env")
            print("✅ .env file created. Please update database settings if needed.")
        else:
            print("❌ .env.example not found. Please create .env file manually.")
            return False
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        return False
    
    print("✅ Requirements check passed!")
    return True

async def test_ai_apis():
    """Test AI API connections"""
    print("\n🤖 Testing AI API connections...")
    
    from app.core.config import settings
    
    # Test OpenAI API
    if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key_here":
        print("✅ OpenAI API key configured")
    else:
        print("⚠️ OpenAI API key not configured properly")
    
    # Test Llama API (Groq)
    if settings.LLAMA_API_KEY and settings.LLAMA_API_KEY != "your_llama_api_key_here":
        print("✅ Llama API key (Groq) configured")
    else:
        print("⚠️ Llama API key (Groq) not configured properly")

def main():
    """Main startup function"""
    print("🚀 Traffic Violation Detection System - Backend Startup")
    print("=" * 60)
    
    # Change to backend directory if not already there
    backend_dir = Path(__file__).parent
    if backend_dir != Path.cwd():
        os.chdir(backend_dir)
        print(f"📁 Changed to backend directory: {backend_dir}")
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Startup failed. Please fix the issues above.")
        return
    
    # Test AI APIs
    try:
        asyncio.run(test_ai_apis())
    except Exception as e:
        print(f"⚠️ Could not test AI APIs: {e}")
    
    print("\n🎯 Ready to start! Run one of these commands:")
    print("📦 Install dependencies: pip install -r requirements.txt")
    print("🗄️ Initialize database: python init_db.py")
    print("🚀 Start development server: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    print("📖 API Documentation will be at: http://localhost:8000/docs")
    print("🌐 WebSocket endpoints at: ws://localhost:8000/ws/")
    
    print("\n🔑 Default credentials after database initialization:")
    print("   Admin: admin / admin123")
    print("   Operator: operator / operator123")

if __name__ == "__main__":
    main()