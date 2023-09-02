import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import makeRequest from '../../utils/makeRequest';
import { homeUri } from '../../constants/Uri/config';

Modal.setAppElement('#root');

interface AddTeamModalProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (data: any) => void;
}

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
  },
};

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({
    empNos: [JSON.parse(localStorage.getItem('email') || '')],
    description: '',
  });

  const [users, setUsers] = useState<any>([]);
  const [description, setDescription] = useState('');
  const [empNos, setEmpNos] = useState<any>(['']);

  const handleSubmit = () => {
    onSubmit({ description: description, empNos: formData.empNos });
    setDescription('');
    setEmpNos(['']);
    onClose();
  };

  const handleEmpNosChange = (selectedOptions: any) => {
    const selectedEmpNos = selectedOptions.map((option: any) => option.value);
    setFormData({ ...formData, empNos: selectedEmpNos });
  };

  useEffect(() => {
    makeRequest(homeUri.getAllUsers, 'GET', {}, { authorization: localStorage.getItem('token') || 'null' }).then((res) => {
      setUsers(res);
      return res;
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Team</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <input
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Guest(s):</label>
          <Select
            isMulti
            options={users.map((user: any) => ({ value: user.email, label: user.email }))}
            value={formData.empNos.map((email: any) => ({ value: email, label: email })) || null}
            onChange={handleEmpNosChange}
            placeholder="Select guest(s)"
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
            onClick={handleSubmit}
          >
            Add Team
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeamModal;
