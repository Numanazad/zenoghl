const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

var tokenglobal;

const gettoken = async (userData) => {
  console.log("inside gettoken");
  const tokenurl = "https://api.zenoti.com/v1/tokens";
  try {
    const response = await axios.post(tokenurl,
      {
        account_name: "ivnutritionnow",
        user_name: "justin@ivlaunch.com",
        password: "Password123!",
        grant_type: "password",
        app_id: "6D82F90E-BEB7-4C62-ADE3-7E0FA0EB1E82",
        app_secret: "e24d8fcb53cf40999a9a93baa72e94624b6199a6775246c990985b8f979a3337",
        device_id: "c113476f-04e1-484c-b887-57414441cdcf", 
        date: "2023-08-29T10:00:00"
      }
      );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getGuestData = async (databody)=>{
  console.log("inside getGuestData");
  try {
    const getguestresult = await axios.get(
      "https://api.zenoti.com/v1/guests/search",
      {
        params:{
          center_id:"8a2c0318-d605-481c-b100-e32e77104b66",
          user_name:"testing@gmail.com"
        },
        headers:{
          Authorization: `Bearer ${tokenglobal}`,
          "accept": 'application/json'
        }
      }
    );
    return getguestresult.data;
  } catch (error) {
    console.log("getAllGuest API error: ", error.response);
  }
}

const createGuest = async (bodydata)=>{
  // check if user already exists:
  console.log("inside createGuest");
  try {
    const guestdata = await axios.post(
      "https://api.zenoti.com/v1/guests",
      {
        center_id:bodydata.center_id,
        personal_info:{
          user_name: bodydata.personal_info.user_name,
          first_name: bodydata.personal_info.first_name,
          last_name: bodydata.personal_info.last_name,
          middle_name:bodydata.personal_info.middle_name,
          email: bodydata.personal_info.email,
          date_of_birth:bodydata.personal_info.date_of_birth,
          mobile_phone:{
            country_code:bodydata.personal_info.mobile_phone.country_code, 
            phone_code:bodydata.personal_info.mobile_phone.phone_code,
            number:bodydata.personal_info.mobile_phone.number
          }
          },
          address_info: {
          address_1: bodydata.address_info.address_1,
          address_2: bodydata.address_info.address_2,
          city: bodydata.address_info.city,
          country_id: bodydata.address_info.country_id,
          state_id: bodydata.address_info.state_id,
          state_other: bodydata.address_info.state_id,
          zip_code: bodydata.address_info.zip_code
          }
      },
      {
        headers:{
          Authorization: `Bearer ${tokenglobal}`,
          "accept": 'application/json',
          "content-type": 'application/json'
        }
      }
    );
    return guestdata.data;
  } catch (error) {
    console.error("API error create guest: ", error.response.data);
  }
}

//get center id:
// const getcenterid = async (formaltokenvalue) =>{
//   const centresurl = "https://api.zenoti.com/v1/centers";
//   try {
//     const getcenterresponse = await axios.get(
//     centresurl, 
//     {
//       params: {
//         expand: 8
//       },
//       headers: {
//         Authorization: `Bearer ${formaltokenvalue}`
//       }
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('API error:', error.response.data);
//     });
//     return getcenterresponse;
//   } catch (error) {
//     console.error("API error:", error);
//   }
// }

const createservicebooking = async (bodydata, guestId)=>{
  console.log("inside createservicebooking");
  const createservicebookingurl = "https://api.zenoti.com/v1/bookings";
  try {
    const createservicebookingresponse = await axios.post(
      createservicebookingurl, 
      {
        is_only_catalog_employees: false, 
        center_id: "8a2c0318-d605-481c-b100-e32e77104b66", 
        date:bodydata.date,
        guests:[
          {
            items:[
              {
                item:{
                  id: "8f28daa6-f881-4ee6-ab29-e9518bc709fb"
                }, 
                therapist:{
                  id:  "d2887e76-f641-4630-90e4-f430927f3115",
                  gender: "0"
                }
              }
            ],
            id: guestId
          }
        ],
      },
      {
        params:{
          is_double_booking_enabled: false
        },
        headers: {
          Authorization: `Bearer ${tokenglobal}`,
          "accept": 'application/json',
          "content-type": 'application/json'
        }
      }
    );
    return createservicebookingresponse.data;
  } catch (error) {
    console.error("API error:", error.response.data);
  }
}

const createservicebooking_via_future = async (bodydata, formaltokenvalue, new_available_date_via_future, guest_id)=>{
  console.log("inside createservicebooking_via_future");
  const createservicebookingurl = "https://api.zenoti.com/v1/bookings";
  try {
    const createservicebookingresponse = await axios.post(
      createservicebookingurl, 
      {
        is_only_catalog_employees: false, 
        center_id: "8a2c0318-d605-481c-b100-e32e77104b66", 
        date:new_available_date_via_future,
        guests:[
          {
            items:[
              {
                item:{
                  id: "8f28daa6-f881-4ee6-ab29-e9518bc709fb"
                }, 
                therapist:{
                  id: "d2887e76-f641-4630-90e4-f430927f3115",
                  gender: "0"
                }
              }
            ],
            id: guest_id
          }
        ],
      },
      {
        params:{
          is_double_booking_enabled: false
        },
        headers: {
          Authorization: `Bearer ${formaltokenvalue}`,
          "accept": 'application/json',
          "content-type": 'application/json'
        }
      }
    );
    return createservicebookingresponse.data;
  } catch (error) {
    console.error("API error:", error.response.data);
  }
}

const get_slots = async (slot_free_url)=>{
  console.log("inside get_slots");
  try {
    const get_slots_response = await axios.get(
      slot_free_url,
      {
        params: {
          'check_future_day_availability': true
        },
        headers: {
          'Authorization': `Bearer ${tokenglobal}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    );
    //console.log(get_slots_response.data);
    return get_slots_response.data;
  } catch (error) {
    console.error("API error slots:", error);
  }
}

const reserve_slot = async (time, booking_id_from_retrieve_slot)=>{
  try {
    console.log("inside reserve_slot");
    console.log("reserve_slot_time: ", time);
    const slot_reserve_url = `https://api.zenoti.com/v1/bookings/${booking_id_from_retrieve_slot}/slots/reserve`;
    const slot_reserve_response = await axios.post(slot_reserve_url,
      {
        slot_time:time
      }, 
      {
        headers: {
          'Authorization': `Bearer ${tokenglobal}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    );
    return slot_reserve_response.data;
  } catch (error) {
    console.error("API error reserve slot: ", error);
  }
}

const confirm_reserve_slot = async (bookingId) => {
  console.log("inside confirm_reserve_slot");
	try {
		const confirm_reserve_data = await axios
			.post(
				`https://api.zenoti.com/v1/bookings/${bookingId}/slots/confirm`,
				'',
				{
					headers: {
						Authorization: `Bearer ${tokenglobal}`,
						accept: 'application/json',
						'content-type': 'application/json',
					},
				}
			)
      return confirm_reserve_data.data;
	} catch (e) {
		console.log(e);
	}
};

const retrieve_available_slots_url_function = async (retrieve_available_slots_url, bodydata, bookingId, guest_id)=>{
  console.log("inside retrieve_available_slots_url_function");
  let user_selected_date = bodydata.date;
  let available_date_time_result;
  const available_slots = await get_slots(retrieve_available_slots_url);
    if(available_slots.Error == null){
      if(available_slots.slots.length>0){
        const selectedSlot = available_slots.slots.find(slot=>{
            return slot.Time>=user_selected_date;
        });
        console.log("selectedSlot: ", selectedSlot);
        const actual_selectedSlotValue = selectedSlot.Time;
        available_date_time_result = await reserve_slot(actual_selectedSlotValue, bookingId);
        const final_confirmation = await confirm_reserve_slot(bookingId);
        return final_confirmation;

      }else if(available_slots.slots.length<1 && available_slots.future_days.length>0){

        if(available_slots.next_available_day == null){
          console.log("no slots available in future.");
        }
        //find the next available slot.
        const next_available_day_data = available_slots.next_available_day;
        //send the request all over again with the next_available_day_data.
        const create_service_response_via_future = await createservicebooking_via_future(bodydata, tokenglobal, next_available_day_data, guest_id);
        const booking_id_via_future = create_service_response_via_future.id;
        const retrieve_available_slots_url_via_future = `https://api.zenoti.com/v1/bookings/${booking_id_via_future}/slots`;
        await retrieve_available_slots_url_function(retrieve_available_slots_url_via_future,bodydata, bookingId);
        
      }else{
        res.json({"result":"no slots available"});
      }
    }
}

const guest_create_service = async (bodydata, guest_id)=>{
  console.log("inside guest_create_service");
  const createservice_response = await createservicebooking(bodydata, guest_id);
  const booking_id = createservice_response.id;
  //retrieve available slots for appointment
  const retrieve_available_slots_url = `https://api.zenoti.com/v1/bookings/${booking_id}/slots`;
  const slot_reserve_response = await retrieve_available_slots_url_function(retrieve_available_slots_url, bodydata, booking_id, guest_id);
  return slot_reserve_response;
}

app.post("/gettoken", async (req, res) => {
  try {
    //get access token
    const token = await gettoken(req.body);
    const tokenvalue = token.credentials.access_token;
    tokenglobal = tokenvalue;
    //check if already exits:
    const getGuest_result = await getGuestData(req.body);
    if (getGuest_result.guests.length == 0) {
      const create_guest_data = await createGuest(req.body);
      const new_user_create_service = await guest_create_service(req.body, create_guest_data.id);
      //console.log(new_user_create_service);
    }else {
      const guest_service_booking_result = await guest_create_service(req.body, getGuest_result.guests[0].id);
    }
    res.json({"status":"success"});
    } catch (error) {
        console.error("API error gettoken: ",error);
        }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
