# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Database Code refactor 
- video, splat and uploaded and thumbnail data will be fetched from S3 in a single api call
- The database will be storing the s3 keys instead of the full path to support

## [0.2.1] - 2025-02-04

- ### Fixed
- Bug fixed related to handling file uploads with special characters

## [0.2.0] - 2025-02-01

### Added
- Galleries for splats
- Admin Dashboard to add splats directly to the DB and manage galleries

### Changed
- Change project name to GaussianGalleria with the description
- Replaced splats view on the homepage with gallery view
- Updated Next.js to version 14.2.23

### Removed
- Old documentation from README

### Fixed
- Dark mode works correctly

## [0.1.0] - 2024-12-29

### Added
- Initial release
- Load Splats and Preview video from S3
- Metadata stored in NeonDB

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

[0.1.0]: https://github.com/naga-k/3D_Portfolio/releases/tag/v0.1.0
