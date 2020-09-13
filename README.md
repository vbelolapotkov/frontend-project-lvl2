[![Maintainability](https://api.codeclimate.com/v1/badges/491d76bd293505526ae2/maintainability)](https://codeclimate.com/github/vbelolapotkov/frontend-project-lvl2/maintainability)
![CI](https://github.com/vbelolapotkov/frontend-project-lvl2/workflows/CI/badge.svg)
[![Test Coverage](https://api.codeclimate.com/v1/badges/491d76bd293505526ae2/test_coverage)](https://codeclimate.com/github/vbelolapotkov/frontend-project-lvl2/test_coverage)

# frontend-project-lvl2

Library for generating diff of two config files.

## Installation

Run following commands in terminal to install:

```bash
git clone https://github.com/vbelolapotkov/frontend-project-lvl2.git ./gen-diff
cd gen-diff
npm install --production
npm link
```

## Usage

```bash
gendiff [options] <filepath1> <filepath2>

Options:
  -V, --version        output the version number
  -f, --format [type]  output format
  -h, --help           output usage information
```

## Demo

**Plain objects demo**

[![asciicast](https://asciinema.org/a/HrXcyKLWdejNAxveCvqoATbug.svg)](https://asciinema.org/a/HrXcyKLWdejNAxveCvqoATbug)

**Nested objects demo**

[![asciicast](https://asciinema.org/a/cCITHb4VqEpUjgomK3A3Q8iM5.svg)](https://asciinema.org/a/cCITHb4VqEpUjgomK3A3Q8iM5)

**Plain output format demo**

[![asciicast](https://asciinema.org/a/OscR69iBL2vHrQcufiVam6ssT.svg)](https://asciinema.org/a/OscR69iBL2vHrQcufiVam6ssT)

**JSON output format demo**

[![asciicast](https://asciinema.org/a/MZ3kqjhHMIu6OAsyKD3DfqTWU.svg)](https://asciinema.org/a/MZ3kqjhHMIu6OAsyKD3DfqTWU)