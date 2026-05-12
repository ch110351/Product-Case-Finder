# CYP Product Case Finder PRD
Version: 0.1
Date: 2026/05/12

---

# 1. Introduction

## 1.1 Overview

This document defines the Product Requirements Document (PRD) for the CYP Product Case Finder system.

The product is a Windows-based internal productivity tool designed to help sales teams, product managers, FAE, and marketing teams quickly locate PowerPoint presentation files that contain specific CYP product references.

The system scans PowerPoint files (`.pptx`) within designated folders, extracts slide text content, builds a searchable product index database, and allows users to search for product names to identify related presentation files and slide locations.

The primary objective of the system is to improve internal knowledge reuse, reduce document searching time, and enhance solution proposal efficiency.

---

## 1.2 Feature

- Scan and index PowerPoint presentation files (`.pptx`)
- Extract slide text content from presentations
- Build searchable product keyword indexes
- Support product keyword search
- Display matched PPT files and slide locations
- Open original PPT files directly
- Support recursive folder scanning
- Store searchable index in SQLite database
- Rebuild and refresh search index
- Support partial keyword matching
- Support case-insensitive search
- Windows desktop application operation
