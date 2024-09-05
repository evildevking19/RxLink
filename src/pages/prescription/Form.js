import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { InputBase, IconButton } from '@mui/material';

import AutoInput from 'components/AutoInput';
import { autoPatientComplete, autoPharmacyComplete } from 'store/reducers/prescription';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import toastr from 'toastr';
import AnimateButton from 'components/@extended/AnimateButton';

import { setEditMode, savePrescription } from 'store/reducers/prescription';

const Form = () => {
  const focusDrug = useRef(null);
  const [focus, setFocus] = useState(null);
  const dispatch = useDispatch();
  const { autoPatients, autoPharmacys, saveStatus, editData } = useSelector((state) => state.prescription);
  const [drugs, setDrugs] = useState([]);
  const [id, setId] = useState(null);
  const [patient, setPatient] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [patientKey, setPatientKey] = useState('0-patient-auto');
  const [pharmacyKey, setPharmacyKey] = useState('0-pharmacy-auto');

  const handlePatientComplete = (text) => {
    dispatch(autoPatientComplete(text));
  };
  const handlePatientChange = (data) => {
    setPatient(data);
  };
  const handlePharmacyComplete = (text) => {
    dispatch(autoPharmacyComplete(text));
  };
  const handlePharmacyChange = (data) => {
    setPharmacy(data);
  };

  const handleAddDrug = () => {
    const lastDrug = drugs[drugs.length - 1];
    if (lastDrug && (!lastDrug.name || !lastDrug.count)) {
      toastr.warning('Please fill in all compulsary fields');
      return;
    }
    setDrugs([...drugs, { name: '', count: '', notes: '' }]);
  };
  const handleDeleteDrug = (index) => {
    setDrugs(drugs.filter((item, id) => id !== index));
  };
  const handleChangeDrugName = (index) => (e) => {
    setDrugs(drugs.map((item, id) => (id === index ? { ...item, name: e.target.value } : item)));
  };
  const handleChangeDrugCount = (index) => (e) => {
    setDrugs(drugs.map((item, id) => (id === index ? { ...item, count: e.target.value } : item)));
  };
  const handleChangeDrugNotes = (index) => (e) => {
    setDrugs(drugs.map((item, id) => (id === index ? { ...item, notes: e.target.value } : item)));
  };
  const handleKeyDown = (index) => (e) => {
    if (e.keyCode === 13) {
      if (index !== drugs.length - 1) {
        setFocus(focus + 1);
        return;
      }
      if (index === drugs.length - 1 && drugs[index].name && drugs[index].count) {
        handleAddDrug();
      }
    }
  };
  const handleSave = () => {
    if (!patient) {
      toastr.warning('Select the patient');
      return;
    }
    let validDrugs = drugs.filter((item) => item.name && item.count);
    if (validDrugs.length === 0) {
      toastr.warning('Input the drugs');
      return;
    }
    dispatch(savePrescription({ id, drugs: validDrugs, patient: patient._id, pharmacy: pharmacy ? pharmacy._id : null }));
    dispatch(setEditMode(false));
  };
  const handleRowFocus = (index) => {
    setFocus(index);
  };
  const resetForm = () => {
    setDrugs([]);
    setPatient('');
    setPharmacy('');
    let patientKeyArray = patientKey.split('-');
    let pharmacyKeyArray = pharmacyKey.split('-');
    const keyNumber = Number.parseInt(patientKeyArray[0]);
    patientKeyArray[0] = keyNumber + 2;
    pharmacyKeyArray[0] = keyNumber + 2;
    setPatientKey(patientKeyArray.join('-'));
    setPharmacyKey(pharmacyKeyArray.join('-'));
  };

  useEffect(() => {
    if (saveStatus === 'success') {
      resetForm();
    }
  }, [saveStatus]);

  useEffect(() => {
    if (editData._id) {
      setDrugs(editData.drugs);
      setId(editData._id);
      setPatient(editData.patient);
      setPharmacy(editData.pharmacy);
    }
  }, [editData]);

  useEffect(() => {
    if (drugs.length > 0) {
      setFocus(drugs.length - 1);
    }
  }, [drugs]);

  useEffect(() => {
    if (focusDrug.current) {
      focusDrug.current.children[0].focus();
    }
  }, [focus, focusDrug]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item sm={6} xs={12}>
          <table className="drugs-table">
            <thead>
              <tr>
                <th width="50%">Drug</th>
                <th width="20%">Dosage</th>
                <th width="20%">Notes</th>
                <th width="10%"></th>
              </tr>
            </thead>
            <tbody>
              {drugs &&
                drugs.map((item, index) => (
                  <tr key={index} onKeyDown={handleKeyDown(index)} onFocus={() => handleRowFocus(index)}>
                    <td>
                      <InputBase
                        ref={focus === index ? focusDrug : null}
                        placeholder="Name"
                        onChange={handleChangeDrugName(index)}
                        className="drug-field"
                        value={item.name}
                      />
                    </td>
                    <td>
                      <InputBase
                        type="text"
                        placeholder="Dosage"
                        onChange={handleChangeDrugCount(index)}
                        className="drug-field"
                        value={item.count}
                      />
                    </td>
                    <td>
                      <InputBase
                        type="text"
                        placeholder="Notes"
                        onChange={handleChangeDrugNotes(index)}
                        className="drug-field"
                        value={item.notes}
                      />
                    </td>
                    <td>
                      <IconButton onClick={() => handleDeleteDrug(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              <tr onClick={handleAddDrug} id="button-add-drug">
                <td colSpan={4}>+ Add the drug.</td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item sm={6} xs={12} container flexDirection="column" gap={2}>
          <Box>
            <label htmlFor="patient">
              Patient <span style={{ color: 'red' }}>*</span>:
            </label>
            <AutoInput
              key={patientKey}
              name="patient"
              data={autoPatients}
              value={patient}
              autocomplete={handlePatientComplete}
              onChange={handlePatientChange}
              placeholder="Select the Patient"
            />
          </Box>
          <Box>
            <label htmlFor="pharmacy">Pharmacy:</label>
            <AutoInput
              key={pharmacyKey}
              data={autoPharmacys}
              value={pharmacy}
              autocomplete={handlePharmacyComplete}
              onChange={handlePharmacyChange}
              placeholder="Select the Pharmacy"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AnimateButton>
              <Button
                type="button"
                onClick={() => dispatch(setEditMode(false))}
                variant="outlined"
                color="primaryb"
                fullWidth
                size="large"
                startIcon={<KeyboardReturnIcon />}
              >
                Return to Prescription List
              </Button>
            </AnimateButton>
            <AnimateButton>
              <Button
                onClick={handleSave}
                disableElevation
                fullWidth
                size="large"
                type="button"
                variant="contained"
                color="primaryb"
                startIcon={<SaveIcon />}
              >
                Save Prescription
              </Button>
            </AnimateButton>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Form;
