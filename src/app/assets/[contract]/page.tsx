"use client";
import { useParams, usePathname } from "next/navigation";

export default function Asset() {
  // Option 1: Using usePathname to manually parse the parameter
  const pathname = usePathname();
  const contractId = pathname.split("/").pop(); // Assuming the URL is /assets/<contractId>

  // Option 2: Using useParams (preferred if available in your version of Next.js)
  const { contract } = useParams<{ contract: string }>();

  return (
    <div>
      <h1>Asset Contract Page</h1>
      {/* Use either `contractId` from Option 1 or `contract` from Option 2 */}
      <p>Contract ID: {contract}</p>
    </div>
  );
}
