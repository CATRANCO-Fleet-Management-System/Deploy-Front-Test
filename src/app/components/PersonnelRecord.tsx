import React from "react";

interface RecordBoxProps {
  driverId: string;
  driverName: string;
  birthday: string;
  age: number;
  gender?: string; // Make gender optional
  licenseNumber?: string; // Make licenseNumber optional
  address: string;
  contactNumber: string;
  contactPerson: string;
  contactPersonNumber?: string; // Make contactPersonNumber optional
  onDelete: () => void;
}

const PersonnelRecord: React.FC<RecordBoxProps> = ({
  driverId,
  driverName,
  birthday,
  age,
  gender,
  licenseNumber,
  address,
  contactNumber,
  contactPerson,
  contactPersonNumber,
  onDelete
}) => {
  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Name:</td>
            <td className="border p-2">{driverName}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">ID:</td>
            <td className="border p-2">{driverId}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Birthday:</td>
            <td className="border p-2">{birthday}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Age:</td>
            <td className="border p-2">{age}</td>
          </tr>
          {gender && ( // Conditionally render the Gender row
            <tr>
              <td className="border p-2 font-bold">Gender:</td>
              <td className="border p-2">{gender}</td>
            </tr>
          )}
          {licenseNumber && ( // Conditionally render the License Number row
            <tr>
              <td className="border p-2 font-bold">License Number:</td>
              <td className="border p-2">{licenseNumber}</td>
            </tr>
          )}
          <tr>
            <td className="border p-2 font-bold">Address:</td>
            <td className="border p-2">{address}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Phone Number:</td>
            <td className="border p-2">{contactNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Contact Person:</td>
            <td className="border p-2">{contactPerson}</td>
          </tr>
          {contactPersonNumber && ( // Conditionally render the Contact Person Number row
            <tr>
              <td className="border p-2 font-bold">Contact Person Number:</td>
              <td className="border p-2">{contactPersonNumber}</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={onDelete}
      >
        Remove
      </button>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        View Bio Data
      </button>
    </div>
  );
};

export default PersonnelRecord;
