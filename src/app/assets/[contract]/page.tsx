"use client";
import { useParams } from "next/navigation";

export default function Asset() {
  // Option 2: Using useParams (preferred if available in your version of Next.js)
  const { contract } = useParams<{ contract: string }>();
  console.log("🚀 « contract:", contract);

  return (
    <div>
      <h1>Asset Contract Page</h1>
      {/* Use either `contractId` from Option 1 or `contract` from Option 2 */}
      <p>Contract ID: {contract}</p>
    </div>
  );
}
