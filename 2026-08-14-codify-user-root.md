---
title: Codify – User & Root
category: Machine
difficulty: Easy
author: "@handle_02"
date: 2026-08-14
---

# Codify – User & Root

> Beispiel-Writeup als Vorlage. Struktur gern übernehmen, Inhalt ersetzen.

## Recon

```
nmap -sC -sV -oN nmap.txt <target>
```

Kurz notieren, welche Ports offen sind und was auffällt.

## Foothold

Wie kam der erste Zugang zustande? (Web-Schwachstelle, Fehlkonfig, ...)

## Privilege Escalation

Welcher Weg führte zu root? (SUID, sudo-Regel, Cronjob, ...)

## Lessons Learned

- Was war der Kniff?
- Was hätte schneller zum Ziel geführt?
