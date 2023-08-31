import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { homeUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import Select from 'react-select';

Modal.setAppElement('#root');

interface AddTeamModalProps {
    onClose: () => void;
    isOpen: boolean;
    onSubmit: (data: any) => void;
  }

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({
    empNos: [JSON.parse(localStorage.getItem('email') || '')],
    description: ''
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
    makeRequest(homeUri.getAllUsers, 'GET', {},
      {
        authorization: localStorage.getItem('token') || 'null',
      }).then(res => {
      setUsers(res);
      return res;
    });
  }
  , []);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Add New Team</h2>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Select
        isMulti
        options={users.map((user: any) => ({ value: user.email, label: user.email }))}
        value={formData.empNos.map((email: any) => ({ value: email, label: email })) || null}
        onChange={handleEmpNosChange}
        placeholder="Select guest(s)"
      />
      <button onClick={handleSubmit}>Add Team</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default AddTeamModal;
