# Project-Bounty — Mission Management Backend

A TypeScript/Node.js backend built as a **2025 UNSW College team coursework project**. This page describes **Jiawen Lin's contributions**, not sole ownership of the team's application.

## At a glance

- **Stack:** TypeScript, JavaScript, Node.js, Express, Jest
- **Focus:** REST endpoints, session validation, resource ownership checks, HTTP tests and file persistence
- **Scope:** Educational backend project; no production deployment or benchmark claims

## My contributions

- Implemented four mission operations: create, list, view details and delete.
- Added session and ownership checks with appropriate HTTP error responses.
- Implemented launch-vehicle detail retrieval and associated launch-history information.
- Wrote Jest HTTP tests for successful requests, invalid resource IDs and missing or invalid sessions.
- Migrated authentication, mission and helper modules from JavaScript to TypeScript.
- Added JSON-file persistence and reorganised business logic and route modules.

## Engineering discussion

The project gave me practice separating HTTP handling from application logic, maintaining types across shared data structures, and testing both successful and rejected requests. The persistence work used a JSON file, not a production database.

## Validation and limitations

Some launch-vehicle test suites were skipped in the reviewed source. The existence of test cases does not establish a passing current test suite or a coverage percentage. This portfolio update does not certify that all tests pass.

## 中文简介

2025年课程团队项目，使用 TypeScript、Node.js、Express 和 Jest 开发任务管理后端。个人贡献包括四类任务 REST 操作、会话与资源归属校验、载具详情及历史记录查询、HTTP 测试、JavaScript 至 TypeScript 迁移和 JSON 文件持久化。团队整体成果与个人工作分别说明，不将团队全部功能归为个人独立完成。

## Repository notes

This README is a recruiting-oriented overview. The original coursework brief remains available in Git history. The repository contains team work; this overview does not relicense other contributors' work or grant permission to reuse coursework solutions.

See also: [Sharpie portfolio](https://github.com/kayzenline/sharpie-portfolio).
