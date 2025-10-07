import axios from 'axios';
import { parseString } from 'xml2js';

export class VIESService {
  static async validateVAT(countryCode, vatNumber) {
    try {
      const soapRequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
          <soapenv:Header/>
          <soapenv:Body>
            <urn:checkVat>
              <urn:countryCode>${countryCode}</urn:countryCode>
              <urn:vatNumber>${vatNumber}</urn:vatNumber>
            </urn:checkVat>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      const response = await axios.post(
        'https://ec.europa.eu/taxation_customs/vies/services/checkVatService',
        soapRequest,
        {
          headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': ''
          }
        }
      );

      return new Promise((resolve, reject) => {
        parseString(response.data, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const responseData = result['soap:Envelope']['soap:Body'][0]['checkVatResponse'][0];
          const isValid = responseData.valid[0] === 'true';
          
          resolve({
            valid: isValid,
            name: isValid ? responseData.name[0] : null,
            address: isValid ? responseData.address[0] : null,
            countryCode: responseData.countryCode[0],
            vatNumber: responseData.vatNumber[0],
            requestDate: responseData.requestDate[0]
          });
        });
      });
    } catch (error) {
      console.error('VIES API error:', error);
      throw new Error('VIES service unavailable');
    }
  }

  static async validateNIP(nip) {
    // Polish NIP validation
    const cleanNIP = nip.replace(/[-\s]/g, '');
    
    if (!/^\d{10}$/.test(cleanNIP)) {
      return { valid: false, error: 'Invalid NIP format' };
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanNIP[i]) * weights[i];
    }

    const checksum = sum % 11;
    const isValid = checksum === parseInt(cleanNIP[9]);

    if (isValid) {
      // Try to validate through VIES for EU companies
      try {
        const viesResult = await this.validateVAT('PL', cleanNIP);
        return viesResult;
      } catch (error) {
        // If VIES fails, return local validation result
        return {
          valid: true,
          countryCode: 'PL',
          vatNumber: cleanNIP,
          requestDate: new Date().toISOString()
        };
      }
    }

    return { valid: false, error: 'Invalid NIP checksum' };
  }
}