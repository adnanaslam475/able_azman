import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import {
  features,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function Users() {
  const { api } = useContext(FirebaseContext);
  const {
    addUser,
    editUser,
    deleteUser,
    checkUserExists
  } = api;
  const [data, setData] = useState([]);
  const [cars, setCars] = useState({});
  const usersdata = useSelector(state => state.usersdata);
  const cartypes = useSelector(state => state.cartypes);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (usersdata.users) {
      setData(usersdata.users.filter(user => user.usertype === 'driver' && ((user.fleetadmin === auth.info.uid && auth.info.profile.usertype === 'fleetadmin') || auth.info.profile.usertype === 'admin')));
    } else {
      setData([]);
    }
  }, [usersdata.users, auth.info.profile.usertype, auth.info.uid]);

  useEffect(() => {
    if (cartypes.cars) {
      let obj = {};
      cartypes.cars.map((car) => obj[car.name] = car.name)
      setCars(obj);
    }
  }, [cartypes.cars]);

  const columns = [
    { title: language.createdAt, field: 'createdAt', editable: 'never', defaultSort: 'desc', render: rowData => rowData.createdAt ? new Date(rowData.createdAt).toLocaleString(dateStyle) : null },
    { title: language.first_name, field: 'firstName', initialEditValue: '' },
    { title: language.last_name, field: 'lastName', initialEditValue: '' },
    { title: language.email, field: 'email', editable: 'onAdd' },
    { title: language.mobile, field: 'mobile', editable: 'onAdd' },
    { title: language.profile_image, field: 'profile_image', render: rowData => rowData.profile_image ? <img alt='Profile' src={rowData.profile_image} style={{ width: 50, borderRadius: '50%' }} /> : null, editable: 'never' },
    { title: language.vehicle_model_name, field: 'vehicleMake', initialEditValue: '' },
    { title: language.vehicle_model_no, field: 'vehicleModel', initialEditValue: '' },
    { title: language.vehicle_reg_no, field: 'vehicleNumber', initialEditValue: '' },
    { title: language.other_info, field: 'other_info', initialEditValue: '' },
    { title: language.car_type, field: 'carType', lookup: cars },
    { title: language.account_approve, field: 'approved', type: 'boolean', initialEditValue: true },
    { title: language.driver_active, field: 'driverActiveStatus', type: 'boolean', initialEditValue: true },
    { title: language.lisence_image, field: 'licenseImage', render: rowData => rowData.licenseImage ? <img alt='License' src={rowData.licenseImage} style={{ width: 100 }} /> : null, editable: 'never' },
    //my addition
    {
      title: language.drivinglicense_img, field: 'drivinglicense_img',
      render: rowData => rowData.drivinglicense_img ? <img alt='License' src={rowData.drivinglicense_img}
        style={{ width: 100 }} /> : null, editable: 'never'
    },
    {
      title: language.idcard_image, field: 'idcard_image', render: rowData => rowData.idcard_image ?
        <img alt='License'
          src={rowData.idcard_image}
          style={{ width: 100 }} /> : null, editable: 'never'
    },
    {
      title: language.passenger_id_passImg, field: 'passenger_id_passImg', render: rowData => rowData.passenger_id_passImg ?
        <img alt='License'
          src={rowData.passenger_id_passImg}
          style={{ width: 100 }} /> : null, editable: 'never'
    },

    { title: language.wallet_balance, field: 'walletBalance', type: 'numeric', editable: 'never', initialEditValue: 0 },
    { title: language.signup_via_referral, field: 'signupViaReferral', editable: 'never' },
    { title: language.referralId, field: 'referralId', editable: 'never', initialEditValue: '' },
    { title: language.bankName, field: 'bankName', initialEditValue: '' },
    { title: language.bankCode, field: 'bankCode', initialEditValue: '' },
    { title: language.bankAccount, field: 'bankAccount', initialEditValue: '' },
    { title: language.queue, field: 'queue', type: 'boolean', initialEditValue: false },
  ];

  return (
    usersdata.loading ? <CircularLoading /> :
      <MaterialTable
        title={language.drivers}
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          sorting: true,
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                checkUserExists(newData).then((res) => {
                  if (res.users && res.users.length > 0) {
                    alert(language.user_exists);
                    reject();
                  }
                  else if (res.error) {
                    alert(language.email_or_mobile_issue);
                    reject();
                  }
                  else {
                    newData['createdByAdmin'] = true;
                    newData['usertype'] = 'driver';
                    newData['createdAt'] = new Date().toISOString();
                    newData['referralId'] = newData.firstName.toLowerCase() + Math.floor(1000 + Math.random() * 9000).toString();
                    let role = auth.info.profile.usertype;
                    if (role === 'fleetadmin') {
                      newData['fleetadmin'] = auth.info.uid;
                    }
                    dispatch(addUser(newData));
                    resolve();
                  }
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editUser(oldData.id, newData));
              }, 600);
            }),
          onRowDelete: oldData =>
            features.AllowCriticalEditsAdmin ?
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  dispatch(deleteUser(oldData.id));
                }, 600);
              })
              :
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  alert(language.demo_mode);
                }, 600);
              })
          ,
        }}
      />
  );
};
// TWILIO_ACCOUNT_SID= AC9d64652ee2f89b855cc37bb4a3a3075c
// TWILIO_AUTH_TOKEN = 7a11d28ff8f97704067002003525a1b3
// TWILIO_SERVICE_ID = VAbc215c4cdb5029100b4f4c7e683fdf6d