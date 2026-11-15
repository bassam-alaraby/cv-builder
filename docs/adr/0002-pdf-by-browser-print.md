# The PDF comes from the browser's print dialog

The PDF is produced by `window.print()` against a print stylesheet, and the
user picks "Save as PDF" in the browser's own dialog. There is no PDF library
in this project.

The alternative was a client side PDF generator: html2pdf.js or html2canvas
rasterise the page into an image, which produces a picture of a CV — many ATS
parsers cannot read it at all — and a real PDF library such as pdfmake would
mean laying the CV out twice, once in HTML for the preview and once in drawing
code for the file, with the two drifting apart. Printing keeps one source of
truth (the template) and real, selectable, vector text. The price is one extra
dialog and the fact that Chrome's print settings have to be right, which is
why the app shows them next to the button.
