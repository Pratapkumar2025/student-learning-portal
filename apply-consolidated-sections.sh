#!/bin/bash

# Script to apply consolidated sections to index.html
# Run this from the student-learning-portal directory

echo "🚀 Applying consolidated sections..."

# Backup original file
cp index.html index.html.backup
echo "✅ Backed up index.html to index.html.backup"

# Step 1: Delete old Leaderboard and Progress sections (lines 307-408)
sed -i.bak2 '307,408d' index.html
echo "✅ Removed old Leaderboard and Progress sections"

# Step 2: Insert new Stats section at line 307
sed -i.bak3 '306r NEW-STATS-SECTION.html' index.html
echo "✅ Added new consolidated Stats section"

# Step 3: Find the end of Gallery section and insert Stories section
# Gallery ends around line 920, we'll insert after it
GALLERY_END=$(grep -n "<!-- Our Gallery Section" index.html | tail -1 | cut -d: -f1)
GALLERY_END=$((GALLERY_END + 500))  # Approximate end

# Insert Stories section
sed -i.bak4 "${GALLERY_END}r CONSOLIDATED-SECTIONS-TO-ADD.html" index.html
echo "✅ Added Stories and Feedback sections"

# Clean up backup files
rm -f index.html.bak2 index.html.bak3 index.html.bak4

echo ""
echo "✅ ALL DONE!"
echo ""
echo "Next steps:"
echo "1. Add JavaScript functions to script.js (see IMPLEMENTATION-GUIDE-CONSOLIDATED.md)"
echo "2. Add CSS styles to styles.css"
echo "3. Test: python -m http.server 8080"
echo ""
echo "To undo changes: mv index.html.backup index.html"
