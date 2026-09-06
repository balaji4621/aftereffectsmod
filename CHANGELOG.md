# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Docker support for containerized deployment
- Pre-commit hooks for automated code quality checks
- GitHub Actions CI/CD pipeline with automated testing, building, and security scanning
- System health check endpoint (`/api/health`) returning CPU, memory, disk, and dependency status
- Preset export functionality to save custom configurations as JSON files
- GPU acceleration option for optical flow calculations using CUDA
- Comprehensive ESLint configuration for TypeScript code quality
- Jest testing framework with initial unit tests for utility functions
- System health dashboard in web UI displaying real-time system metrics
- Custom LUT upload support for color grading presets

### Changed
- Improved error handling and logging throughout Python engine modules
- Enhanced web server with better API documentation and endpoint handling
- Added comprehensive docstrings to all Python modules and functions

## [1.0.0] - 2025-01-01

### Added
- Initial release of Antigravity AI Video Production Engine
- Dual-engine rendering: Remotion (React WebGL) and Adobe After Effects 2025
- Autonomous DAG pipeline with manifest-based state management
- AI-powered style planning using CLIP/ViT/Whisper models
- Audio DSP analysis with multi-band spectral flux extraction
- Word-level forced alignment subtitles
- Optical flow motion vector analysis
- Depth map generation for 3D effects
- Subject matting for behind-text compositing
- SSIM/ΔE2000 QA verification
- Web-based orchestration dashboard
- Beat-synced camera movements
- Karaoke-style caption animations
- Chromatic aberration and film grain effects
- WebGL post-processing passes

### Dependencies
- Node.js 18+
- Python 3.11+
- React 18 + Remotion 4.0
- OpenCV, Librosa, NumPy
- Adobe After Effects 2025 (optional)