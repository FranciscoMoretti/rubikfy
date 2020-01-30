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
        // Maybe re-do without drawImage
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

        var colors = {
            green: { r: 255, g: 255, b: 255 },
            red: { r: 137, g: 18, b: 20 },
            blue: { r: 13, g: 72, b: 172 },
            orange: { r: 255, g: 85, b: 37 },
            white: { r: 25, g: 155, b: 76 },
            yellow: { r: 254, g: 213, b: 47 },
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
            pix[j] = quantizeColor({ r: imgDataData[i], g: imgDataData[i + 1], b: imgDataData[i + 2] });
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

    componentDidUpdate(prevProps) {
        if (this.props.threshold !== prevProps.threshold) {
            this.makeClientCrop(this.props.crop);
        }
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