import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

const qs = require('qs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const getUniqueParam = (token: string) => {
        for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = t.length, o = 0; 10 > o; o++)
            a += t.charAt(Math.floor(Math.random() * n));

        return a + `?token=${token}&expiry=` + Date.now();
    }
    const userAgent = req.headers['user-agent']
    const axiosClient = axios.create({
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://vidply.com',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
        }
    })

    const pass_md5 = req.body.pass_md5
    const token = req.body.token

    try {
        if (pass_md5 == undefined) {
            throw new Error("Required parameter `pass_md5`");
        }
        if (token == undefined) {
            throw new Error("Required parameter `token`");
        }

        var response = await axiosClient.get(`https://vidply.com/pass_md5/${pass_md5}`)

        var url = response.data + getUniqueParam(token)

        var getSizeResponse = await axiosClient.head(url)
        var sizeFile = getSizeResponse.headers['content-length']

        res.status(200).json({
            result: true,
            data: {
                url: url,
                size: sizeFile
            }
        })

    } catch (error: Error | any) {
        res.status(400).json({ result: false, message: error.message })
    }

}