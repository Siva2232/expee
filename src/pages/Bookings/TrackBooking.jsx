// src/pages/TrackBooking.jsx
import DashboardLayout from "../../components/DashboardLayout";
import StatusUpdater from "../../components/StatusUpdater";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import { useState } from "react";

const TrackBooking = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Processing");

  const handleStatusUpdate = (status) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const confirmUpdate = () => {
    setShowModal(false);
    // API integration point here.
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Track Booking</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Booking ID:</h3>
            <p className="text-gray-600">#BOOKING_ID</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Current Status:</span>
            <StatusBadge status={selectedStatus} />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-gray-700 font-semibold mb-3">Update Status</h4>
            <StatusUpdater onUpdate={handleStatusUpdate} />
          </div>
        </div>

        <ConfirmModal
          isOpen={showModal}
          title="Confirm Status Update"
          message={`Change status to "${selectedStatus}"?`}
          onConfirm={confirmUpdate}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default TrackBooking;