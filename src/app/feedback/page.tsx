"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch } from "react-icons/fa";
import FeedbackRecord from "../components/FeedbackRecord";
import { fetchAllFuelLogs } from "../services/feedbackService";
import Pagination from "../components/Pagination";

const FeedbackRecordDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [feedbackRecords, setFeedbackRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackLogs = async () => {
      try {
        setLoading(true);
        const logs = await fetchAllFuelLogs(); // Use the correct service
        console.log("Fetched Feedback Logs:", logs); // Debug response
        setFeedbackRecords(logs.data || []); // Set feedback records
      } catch (error) {
        console.error("Error fetching feedback logs:", error);
        alert("Failed to fetch feedback records. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackLogs();
  }, []);

  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (deleteRecordId) {
      setFeedbackRecords((prevRecords) =>
        prevRecords.filter(
          (record) => record.feedback_logs_id !== deleteRecordId
        )
      );
      setDeleteRecordId(null);
      setIsDeletePopupOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const filteredRecords = feedbackRecords.filter(
    (record) =>
      record.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phone_number?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <Header title="Feedback Records" />
      <div className="content flex flex-col flex-1">
        <div className="options flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4 w-full sm:w-9/12 ml-1">
          <input
            type="text"
            placeholder="Search by phone number or comment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />
        </div>
        {loading ? (
          <div className="text-center text-blue-500 mt-10">
            Loading feedback...
          </div>
        ) : feedbackRecords.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No feedback records found.
          </div>
        ) : (
          <div className="records flex flex-col h-full">
            <div className="output grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 ml-5">
              {paginatedRecords.map((record) => (
                <FeedbackRecord
                  key={record.feedback_logs_id}
                  phoneNumber={record.phone_number || "N/A"}
                  rating={record.rating || 0}
                  comment={record.comments || "No comments available"}
                  date={new Date(record.created_at).toLocaleString()}
                  onDelete={() => handleDelete(record.feedback_logs_id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      <Confirmpopup
        isOpen={isDeletePopupOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback?"
      />
    </Layout>
  );
};

export default FeedbackRecordDisplay;
