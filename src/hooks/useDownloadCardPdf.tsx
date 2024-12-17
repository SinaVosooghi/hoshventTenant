import { gql, useLazyQuery } from "@apollo/client";

// GraphQL query for batch download
const DOWNLOAD_CARDS_PDF = gql`
  query generateBatchCardPdf($users: [UserDataInput!]!) {
    generateBatchCardPdf(data: $users)
  }
`;

const useDownloadCardPdf = () => {
  const [fetchPdf, { loading, error }] = useLazyQuery(DOWNLOAD_CARDS_PDF, {
    onCompleted: async (data) => {
      if (data?.generateBatchCardPdf) {
        const pdfUrl = data.generateBatchCardPdf; // URL returned from backend

        // Fetch the PDF as a Blob
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create an iframe for printing
        const iframe = document.createElement("iframe");
        iframe.style.display = "none"; // Hidden iframe
        iframe.src = blobUrl; // Set the Blob URL as the source
        document.body.appendChild(iframe);

        // Wait for the iframe to load, then trigger the print dialog
        iframe.onload = () => {
          iframe.contentWindow?.focus(); // Focus on iframe content
          iframe.contentWindow?.print(); // Open print dialog

          // Clean up the Blob URL and remove iframe after printing
        };
      }
    },
  });

  const downloadBatchCardPdf = async (users: any) => {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Users array cannot be empty!");
    }

    await fetchPdf({
      variables: {
        users,
      },
    });
  };

  return { downloadBatchCardPdf, loading, error };
};

export default useDownloadCardPdf;
