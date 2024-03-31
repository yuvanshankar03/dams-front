import React, { useState } from 'react';

const DepartmentSelector = ({ isAdmin, onSelectDepartment }) => {
  const [department, setDepartment] = useState('');

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
    onSelectDepartment(selectedDepartment); // Callback to parent component with selected department
  };

  return (
    <select
      value={department}
      onChange={handleDepartmentChange}
      className="mb-2 p-2 border rounded w-full"
    >
      <option value="" className="font-semibold">
        Select a Department
      </option>
      {isAdmin ? (
        <optgroup label="Departments">
          <option value="Department of computer science">
            Department of computer science
          </option>
          <option value="Department of commerce">Department of commerce</option>
          {/* Add more admin options as needed */}
        </optgroup>
      ) : (
        <>
          <optgroup label="Department of Computer Science">
            <option value="Department of Computer Science - Bsc.cs">
              Bsc.cs
            </option>
            <option value="Department of Computer Science - Bsc.IT">
              Bsc.IT
            </option>
            <option value="Department of Computer Science - CA">CA</option>
            <option value="Department of Computer Science - Msc.cs">
              Msc.cs
            </option>
            <option value="Department of Computer Science - MCA">MCA</option>
          </optgroup>
          <optgroup
            label="Department of Commerce"
          >
            <option value="Department of Commerce-Bcom.CA">Bcom.CA</option>
            <option value="Department of Commerce-Bcom">Bcom</option>
            <option value="Department of Commerce-Bcom.BA">Bcom.BA</option>
          </optgroup>
        </>
      )}
    </select>
  );
};

export default DepartmentSelector;
