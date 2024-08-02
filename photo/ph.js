document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('next-button');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    let filesUploaded = { couplePhoto1: false, malePicture: false };

    fileInputs.forEach((input, index) => {
        input.addEventListener('change', function () {
            // Update the filesUploaded object
            if (index === 0) { // Assuming index 0 is for Couple Photo 1
                filesUploaded.couplePhoto1 = input.files.length > 0;
            } else if (index === 2) { // Assuming index 2 is for Male Picture
                filesUploaded.malePicture = input.files.length > 0;
            }

            // Check if both required files are uploaded
            if (filesUploaded.couplePhoto1 && filesUploaded.malePicture) {
                nextButton.disabled = false;
                nextButton.style.opacity = '1';
                nextButton.style.cursor = 'pointer';
                nextButton.style.backgroundColor = 'black'; // Make button black when enabled
            } else {
                nextButton.disabled = true;
                nextButton.style.opacity = '0.5';
                nextButton.style.cursor = 'not-allowed';
                nextButton.style.backgroundColor = 'grey'; // Keep button grey when disabled
            }
        });
    });

    function compressImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800;
                    const maxHeight = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], imageFile.name, {
                            type: imageFile.type,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.7);
                };
                img.onerror = (error) => {
                    reject(error);
                };
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    async function convertToBase64(imageFile) {
        const compressedFile = await compressImage(imageFile);
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => {
                reject(error);
            };
        });
    }

    async function getFileInputValues() {
        const fileInputValues = [];
        for (const input of fileInputs) {
            if (input.files.length > 0) {
                const base64 = await convertToBase64(input.files[0]);
                fileInputValues.push(base64);
            } else {
                fileInputValues.push(''); // Push empty string if no file
            }
        }
        return fileInputValues;
    }

    nextButton.addEventListener('click', async function () {
        const fileInputValues = await getFileInputValues();
        const email = localStorage.getItem("userEmail");
        let data = {
            email: email,
            CouplePhoto1: fileInputValues[0],
            CouplePhoto2: fileInputValues[1],
            MalePicture: fileInputValues[2],
            FemalePicture: fileInputValues[3],
        };

        alert("success!");
        window.location.href = '../Matching/index.html';
    });
});

function previewImage(event, previewElementId, overlayElementId, paragraph1Id, paragraph2Id, svgId, editButtonId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            const ele = document.getElementById(overlayElementId);
            const p1 = document.getElementById(paragraph1Id);
            const p2 = document.getElementById(paragraph2Id);
            const sv = document.getElementById(svgId);
            const edit = document.getElementById(editButtonId);

            ele.style.gap = '0px';
            p1.style.display = 'none';
            p2.style.display = 'none';
            sv.style.display = 'none';

            img.src = e.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '5px';
            img.style.objectFit = 'cover';

            const imagePreview = document.getElementById(previewElementId);
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            imagePreview.style.width = '100%';
            imagePreview.style.height = '100%';
            edit.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

function previewImage1(event) {
    previewImage(event, 'imagePreview1', 'okay', 'p1', 'p2', 'svg', 'edit1');
}

function previewImage2(event) {
    previewImage(event, 'imagePreview2', 'ok2', 'p3', 'p4', 'svg2', 'edit2');
}

function previewImage3(event) {
    previewImage(event, 'imagePreview3', 'ok3', 'p5', 'p6', 'svg3', 'edit3');
}

function previewImage4(event) {
    previewImage(event, 'imagePreview4', 'ok4', 'p7', 'p8', 'svg4', 'edit4');
}
