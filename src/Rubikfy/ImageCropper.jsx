import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './ImageCropper.css';

export default class ImageCropper extends PureComponent {
    state = {
        src: null,
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ percentCrop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            this.props.width,
            this.props.height
        );

        var imgData = ctx.getImageData(
            0, 0, this.props.width, this.props.height);

        var canvasfilters = require('canvas-filters');

        if (String(imgData.data) === "undefined") {
            // return?
        } else {
            // Dither the data using the Atkinson algoritm
            imgData = canvasfilters.Dither(imgData, this.props.threshold);
        }
        var imgDataData = imgData.data;

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }

        var colors = {
            green: '#009B48',
            red: '#B90000',
            blue: '#0045AD',
            orange: '#FF5900',
            white: '#FFFFFF',
            yellow: '#FFD500',
        };

        var nearestColor = require('nearest-color').from(colors);

        const quantizeColor = (image) => {
            if (String(image) === "undefined") {
                return "undefined";
            }

            // LOOP THROUGH THE IMAGE HERE!!
            return nearestColor(image).value;
        }

        const pix = []
        // Loop over each pixel and invert the color.
        for (var i = 0, j = 0, n = imgDataData.length; i < n; i += 4, j += 1) {
            pix[j] = quantizeColor("#" + componentToHex(imgDataData[i]) + componentToHex(imgDataData[i + 1]) + componentToHex(imgDataData[i + 2]));
            // i+3 is alpha (the fourth element)
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                this.props.onImageCropped(pix);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    render() {
        const { croppedImageUrl, src } = this.state;
        return (
            <div className="image-croper">
                <div>
                    <input type="file" acfcept="image/*" onChange={this.onSelectFile} />
                </div>
                {src && (
                    <ReactCrop
                        src={src}
                        crop={this.props.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.props.onCropChange}
                    />
                )}
                {croppedImageUrl && (
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                )}
            </div>
        );
    }
}