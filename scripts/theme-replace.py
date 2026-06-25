#!/usr/bin/env python3
"""Bulk theme replacement: Blue/Silver/White/Gold → Silver/Yellow/White/Red"""
import os, re, glob

REPLACEMENTS = [
    # Primary blue → Red
    ('#0F5EFF', '#E53935'),
    ('#0D4FD4', '#C62828'),
    # Electric blue → Yellow
    ('#38BDF8', '#FFD700'),
    # Dark backgrounds
    ('#081B3A', '#0A0F1A'),
    ('#0B1F3F', '#0E1525'),
    ('#060F23', '#060A14'),
    # rgba blue → rgba red
    ('rgba(15, 95, 255, 0.35)', 'rgba(229, 57, 53, 0.35)'),
    ('rgba(15, 95, 255, 0.3)', 'rgba(229, 57, 53, 0.3)'),
    ('rgba(15, 95, 255, 0.2)', 'rgba(229, 57, 53, 0.2)'),
    ('rgba(15, 95, 255, 0.15)', 'rgba(229, 57, 53, 0.15)'),
    ('rgba(15, 95, 255, 0.12)', 'rgba(229, 57, 53, 0.12)'),
    ('rgba(15, 95, 255, 0.1)', 'rgba(229, 57, 53, 0.1)'),
    ('rgba(15, 95, 255, 0.08)', 'rgba(229, 57, 53, 0.08)'),
    ('rgba(15,95,255,0.35)', 'rgba(229,57,53,0.35)'),
    ('rgba(15,95,255,0.3)', 'rgba(229,57,53,0.3)'),
    ('rgba(15,95,255,0.2)', 'rgba(229,57,53,0.2)'),
    ('rgba(15,95,255,0.15)', 'rgba(229,57,53,0.15)'),
    ('rgba(15,95,255,0.12)', 'rgba(229,57,53,0.12)'),
    ('rgba(15,95,255,0.1)', 'rgba(229,57,53,0.1)'),
    ('rgba(15,95,255,0.08)', 'rgba(229,57,53,0.08)'),
    # rgba electric blue → rgba yellow
    ('rgba(56, 189, 248, 0.2)', 'rgba(255, 215, 0, 0.2)'),
    ('rgba(56, 189, 248, 0.15)', 'rgba(255, 215, 0, 0.15)'),
    ('rgba(56, 189, 248, 0.1)', 'rgba(255, 215, 0, 0.1)'),
    ('rgba(56, 189, 248, 0.08)', 'rgba(255, 215, 0, 0.08)'),
    ('rgba(56,189,248,0.2)', 'rgba(255,215,0,0.2)'),
    ('rgba(56,189,248,0.15)', 'rgba(255,215,0,0.15)'),
    ('rgba(56,189,248,0.1)', 'rgba(255,215,0,0.1)'),
    ('rgba(56,189,248,0.08)', 'rgba(255,215,0,0.08)'),
    # rgba dark blue bg → rgba new dark bg
    ('rgba(14, 34, 72, 0.5)', 'rgba(15, 21, 37, 0.6)'),
    ('rgba(14, 34, 72, 0.6)', 'rgba(15, 21, 37, 0.7)'),
    ('rgba(14, 34, 72, 0.7)', 'rgba(15, 21, 37, 0.8)'),
    ('rgba(14,34,72,0.5)', 'rgba(15,21,37,0.6)'),
    ('rgba(14,34,72,0.6)', 'rgba(15,21,37,0.7)'),
    ('rgba(14,34,72,0.7)', 'rgba(15,21,37,0.8)'),
    # rgba blue bg hover/input
    ('rgba(8, 27, 58, 0.6)', 'rgba(10, 15, 26, 0.7)'),
    ('rgba(8, 27, 58, 0.8)', 'rgba(10, 15, 26, 0.9)'),
    ('rgba(8,27,58,0.6)', 'rgba(10,15,26,0.7)'),
    ('rgba(8,27,58,0.8)', 'rgba(10,15,26,0.9)'),
    ('rgba(8,27,58,0.4)', 'rgba(10,15,26,0.5)'),
    # Sidebar gradient
    ('rgba(15,95,255,0.12)', 'rgba(229,57,53,0.12)'),
    # Tailwind blue class references in brackets (common in inline styles)
    ('[#0F5EFF]', '[#E53935]'),
    ('[#38BDF8]', '[#FFD700]'),
]

count = 0
for pattern in ['src/**/*.tsx', 'src/**/*.ts']:
    for fpath in glob.glob(pattern, recursive=True):
        if 'node_modules' in fpath or '.next' in fpath:
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        for old, new in REPLACEMENTS:
            content = content.replace(old, new)
        if content != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1

print(f"Updated {count} files")