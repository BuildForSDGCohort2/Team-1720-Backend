'use strict';

module.exports = {
    formatAddressInfo(addressInfo) {
        try {
            if (Object.keys(addressInfo).length > 0) {
                const response_arr_obj = {}
                const response_home_obj = {}
                const response_work_obj = {}

                // Home Address
                response_home_obj.street_address = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].street_address : '';
                response_home_obj.suburb = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].suburb : '';
                response_home_obj.city = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].city : '';
                response_home_obj.province = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].province : '';
                response_home_obj.zip_code = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].zip_code : '';
                response_home_obj.country = addressInfo.home_address.length > 0 ? addressInfo.home_address[addressInfo.home_address.length - 1].country : '';
                response_arr_obj.home_address = response_home_obj;

                // Work Address
                response_work_obj.street_address = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].street_address : '';
                response_work_obj.suburb = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].suburb : '';
                response_work_obj.city = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].city : '';
                response_work_obj.province = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].province : '';
                response_work_obj.zip_code = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].zip_code : '';
                response_work_obj.country = addressInfo.work_address.length > 0 ? addressInfo.work_address[addressInfo.work_address.length - 1].country : '';
                response_arr_obj.work_address = response_work_obj;

                // Updated information
                response_arr_obj.last_updated = addressInfo.last_updated.length > 0 ? addressInfo.last_updated[addressInfo.last_updated.length - 1].updated_date : '';


                return response_arr_obj;
            } else {
                return { "message": "No data was provided" };
            }
        } catch (error) {
            console.log(error);
            return { "error": "Data was not sent correctly" }
        }
    }
}