import request from "@/utils/request";

import Loading from "@/components/modal/loading";
import { localeMessage } from ".";

let fileInput;
const UploadFile = ({
	api,
	multiple = false,
	accept = "image/*",
	fileMaxSize = 5
} = {}) => {
	if (!fileInput) fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = accept;
	fileInput.multiple = multiple;

	return new Promise((resolve, reject) => {
		fileInput.onchange = event => {
			const file = event.target.files[0];
			const fileSize = Math.ceil(file.size / 1024); // 不保留小数  可随意用任何方法  如Math
			console.log(fileSize);
			if (fileSize > fileMaxSize * 1024) {
				reject(
					localeMessage("common.maxFileSize", {
						size: `${fileMaxSize}MB`
					})
				);
				return;
			}
			Loading.show({ tip: localeMessage("common.label.imageUploading") });
			request(api, {
				method: "post",
				data: { file },
				formData: true,
				ContentType: "multipart/form-data"
			}).then(({ code, data, errMsg }) => {
				fileInput.value = "";
				Loading.close();
				if (code === 0) {
					resolve(data);
				} else {
					reject(errMsg);
				}
			});
		};

		fileInput.click();
	});
};

export default UploadFile;
