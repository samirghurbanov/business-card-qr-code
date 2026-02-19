// Only allow numbers in phone input
const phoneNumberInput = document.getElementById('phoneNumber');

phoneNumberInput.addEventListener('input', function (e) {
    // Remove any non-digit characters
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const phonePrefix = document.getElementById('phonePrefix').value;
    const phone = phonePrefix + phoneNumber; // Combine prefix with number
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const title = document.getElementById('title').value.trim();
    const website = document.getElementById('website').value.trim();

    // Create vCard format (RFC 6350 requires CRLF line endings)
    let vcard = 'BEGIN:VCARD\r\n';
    vcard += 'VERSION:3.0\r\n';
    vcard += `N:${lastName};${firstName};;;\r\n`;
    vcard += `FN:${firstName} ${lastName}\r\n`;

    if (phone) {
        vcard += `TEL;TYPE=CELL:${phone}\r\n`;
    }

    if (email) {
        vcard += `EMAIL:${email}\r\n`;
    }

    if (company) {
        vcard += `ORG:${company}\r\n`;
    }

    if (title) {
        vcard += `TITLE:${title}\r\n`;
    }

    if (website) {
        vcard += `URL:${website}\r\n`;
    }

    vcard += 'END:VCARD\r\n';

    // Clear previous QR code
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';

    // Generate QR code using QRCode.js
    try {
        new QRCode(qrcodeDiv, {
            text: vcard,
            width: 350,
            height: 350,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M  // Medium error correction to allow more data
        });

        // Show result section
        document.getElementById('qrResult').classList.remove('hidden');

        // Scroll to QR code after a brief delay to ensure it's rendered
        setTimeout(() => {
            qrcodeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

    } catch (error) {
        console.error('QR Code generation error:', error);
        alert('Error generating QR code. Please try again.');
    }
});

// Download QR code functionality
document.getElementById('downloadBtn').addEventListener('click', function () {
    const canvas = document.querySelector('#qrcode canvas');

    if (!canvas) {
        alert('Please generate a QR code first.');
        return;
    }

    // Add a white quiet zone (border) around the QR code for reliable scanning
    const padding = 40;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + padding * 2;

    const ctx = exportCanvas.getContext('2d');
    // Fill white background (quiet zone)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    // Draw the QR code centred inside the padding
    ctx.drawImage(canvas, padding, padding);

    exportCanvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();

        a.href = url;
        a.download = `${firstName}_${lastName}_QR_Code.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
