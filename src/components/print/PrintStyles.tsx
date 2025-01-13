// src/components/print/PrintStyles.tsx
export const PrintStyles = () => (
  <style>
    {`
      @media print {
        /* Hide non-printable elements */
        nav, button, .no-print {
          display: none !important;
        }

        /* Reset background colors */
        body {
          background: white !important;
          color: black !important;
        }

        /* Ensure content fits page */
        .print-container {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Page breaks */
        .print-break-after {
          page-break-after: always;
        }

        .print-break-before {
          page-break-before: always;
        }

        /* Expand collapsed sections */
        .print-expand {
          display: block !important;
        }

        /* Show URLs after links */
        a[href]:after {
          content: " (" attr(href) ")";
        }

        /* Improve table readability */
        table {
          page-break-inside: avoid;
        }

        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        thead {
          display: table-header-group;
        }

        tfoot {
          display: table-footer-group;
        }
      }
    `}
  </style>
)

