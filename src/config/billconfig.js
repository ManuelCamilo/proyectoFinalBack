import nodemailer from 'nodemailer'
import mailgen from 'mailgen'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS,
    }
});


function genEmail(userEmail, productos, montoTotal) {


    const Mailgen = new mailgen({
        theme:'default',
        product: {
            name: 'Coder SHOP',
            link: 'http://www.coderhouse.com'
        }
    })

    const email = {
        body: {
            name: userEmail,
            intro: 'Gracias por tu compra. Aquí está el detalle de tu factura:',
            table: {
                data: productos.map((producto) => ({
                    item: producto.name,
                    description: producto.description,
                    quantity: producto.quantity,
                    price: producto.price,
                }))
            },
            total: {
                text: 'Total',
                price: montoTotal,
            },
            outro: 'Si tiene alguna pregunta, no dudes en contactarnos.'
        }
    }

    const mail = Mailgen.generate(email)
    return mail;
}


export const mailConfig = { transporter: transporter, genEmail: genEmail};