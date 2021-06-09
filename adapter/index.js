const crc16 = require('./crc16');

module.exports = (req) => {

    if(req.body.packet === undefined || req.body.packet == "") {
        return false;
    }
    const __packet = req.body.packet;
    const packet = __packet.replace(/\s/g, '').toLowerCase();

    if ('7878'.indexOf(packet.slice(0, 4)) === -1) {
        return false;
    }

    if(packet.slice(-4) !== '0d0a') {
        return false;
    }

    const protocol_number = packet.slice(6, 8);

    if (protocol_number === '01') {

        let error_check = `0501${packet.slice(32, 36)}`;
        error_check = error_check + crc16(error_check);
        output = `7878${error_check}0d0a`.toLowerCase();

        return {
            input: packet,
            protocol: {
                name: 'Login', 
                number: protocol_number
            },
            information_content: {
                terminal_id: packet.slice(8, 24),
                terminal_type: packet.slice(24, 28),
                timezone_language: packet.slice(28, 32)
            },
            output: output
        };
    }

    if (protocol_number === '22') {

        return {
            input: packet,
            protocol: {
                name: 'GPS', 
                number: protocol_number
            },
            information_content: {
                datetime: packet.slice(8, 20),
                totalSatellites: packet.slice(20,22),
                latitude: packet.slice(22,30),
                longitude: packet.slice(30, 38),
                speed: packet.slice(38, 40),
                courseStatus: packet.slice(40, 44),
                mcc: packet.slice(44, 48),
                mnc: packet.slice(48,50),
                lac: packet.slice(50, 54),
                cell_id: packet.slice(54, 60)
            },
            output: null
        };
    }

    if (protocol_number === '23') {

        let error_check = `0523${packet.slice(18, 22)}`;
        error_check = error_check + crc16(error_check);
        output = `7878${error_check}0d0a`.toLowerCase();

        return {
            input: packet,
            protocol: {
                name: 'Heartbeat', 
                number: protocol_number
            },
            information_content: {
                terminal_info: packet.slice(8, 10),
                voltage_level: packet.slice(10, 14),
                gsm_signal_strength: packet.slice(14, 16),
                language: packet.slice(16, 20)
            },
            info_serial_no: packet.slice(20, 24),
            output: output
        };
    }



}