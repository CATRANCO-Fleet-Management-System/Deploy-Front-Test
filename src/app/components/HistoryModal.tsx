"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const HistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  // Function to generate a PDF from the history table
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Action", "Performed By", "Timestamp", "Details"];
    const tableRows = [];

    history.forEach((record) => {
      const timestamp = record.timestamp
        ? new Date(record.timestamp).toLocaleString()
        : "N/A";
      const row = [
        record.action || "N/A",
        record.performed_by || "N/A",
        timestamp,
        record.details || "N/A",
      ];
      tableRows.push(row);
    });

    // Add title and table to the PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Personnel Record History", 14, 15);
    doc.setFont("helvetica", "normal");
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
    });
    doc.save("Personnel_Record_History.pdf");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Personnel Record History</h2>
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>
        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left text-gray-700">
                    Action
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700">
                    Performed By
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 border-b text-left text-gray-700">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => {
                  const timestamp = record.timestamp
                    ? new Date(record.timestamp).toLocaleString()
                    : "N/A";
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{record.action || "N/A"}</td>
                      <td className="px-4 py-2 border-b">{record.performed_by || "N/A"}</td>
                      <td className="px-4 py-2 border-b">{timestamp}</td>
                      <td className="px-4 py-2 border-b">{record.details || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No history records available.</p>
        )}
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
