# E:\trust_website\app.py
import streamlit as st
import streamlit.components.v1 as components
import os
import base64

# Set up page configurations
st.set_page_config(
    page_title="श्री नारायण नारायणी सेवा ट्रस्ट",
    page_icon="images/logo.jpeg" if os.path.exists("images/logo.jpeg") else "✨",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit header, footer and padding for a clean full-screen look
hide_st_style = """
            <style>
            /* Hide Streamlit components completely so they don't block clicks */
            #MainMenu {display: none !important;}
            footer {display: none !important;}
            header {display: none !important;}
            [data-testid="stHeader"] {display: none !important;}
            [data-testid="stToolbar"] {display: none !important;}
            
            /* Remove margins and padding from Streamlit main container */
            .stApp {
                margin: 0 !important;
                padding: 0 !important;
            }
            .block-container {
                padding-top: 0rem !important;
                padding-bottom: 0rem !important;
                padding-left: 0rem !important;
                padding-right: 0rem !important;
                max-width: 100% !important;
            }
            
            /* Make the iframe fill the viewport and scroll properly */
            iframe {
                border: none !important;
                width: 100% !important;
                height: 100vh !important;
                display: block;
            }
            
            /* Hide parent page scrollbar to avoid double scrollbars */
            body {
                overflow: hidden !important;
            }
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

# Helper function to convert local images to Base64 so they load inside the isolated iframe
def get_image_base64(path):
    if os.path.exists(path):
        with open(path, "rb") as image_file:
            encoded = base64.b64encode(image_file.read()).decode()
            return f"data:image/jpeg;base64,{encoded}"
    return ""

def load_and_bundle_files():
    if not os.path.exists("index.html"):
        return "<h3>Error: index.html not found! Please place it in the same directory.</h3>"
        
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Inline CSS
    if os.path.exists("style.css"):
        with open("style.css", "r", encoding="utf-8") as f:
            css = f.read()
        html = html.replace(
            '<link rel="stylesheet" href="style.css" />',
            f'<style>{css}</style>'
        )

    # 2. Inject local logo.jpeg in base64 format for inline loading
    logo_base64 = get_image_base64("images/logo.jpeg")
    if logo_base64:
        html = html.replace("images/logo.jpeg", logo_base64)
        
    # 3. No routing patch needed since the developer cards are integrated natively in index.html
    
    return html

# Load compiled HTML bundle
html_content = load_and_bundle_files()

# Serve full-page HTML
components.html(html_content, height=1200, scrolling=True)
