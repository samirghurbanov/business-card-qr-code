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
    const phone = '+971' + phoneNumber; // Combine prefix with number
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const title = document.getElementById('title').value.trim();
    const website = document.getElementById('website').value.trim();

    // Create vCard format
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `N:${lastName};${firstName};;;\n`;
    vcard += `FN:${firstName} ${lastName}\n`;

    if (phone) {
        vcard += `TEL;TYPE=CELL:${phone}\n`;
    }

    if (email) {
        vcard += `EMAIL:${email}\n`;
    }

    if (company) {
        vcard += `ORG:${company}\n`;
    }

    if (title) {
        vcard += `TITLE:${title}\n`;
    }

    if (website) {
        vcard += `URL:${website}\n`;
    }

    vcard += 'END:VCARD';

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

    // Convert canvas to blob and download
    canvas.toBlob(function (blob) {
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
