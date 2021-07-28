const stripe = require('stripe')('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');
const stripe_public_key = 'pk_live_51HSw0cGw72f5pBiEEZ29XH0JwzQT7vwzulO1xJA5wROgq19DqxqqG7YhdDSJFWeqwNqmb3MsjkprQKUbphvix9Pd00n9c7h3aY';

const templateLib = require('./template');

module.exports.render_checkout = function(request, response){

    var full_url = request.protocol + "://" + request.get('host');

    var product_name = request.body.product_name?request.body.product_name:"Booking";
    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var currency = request.body.currency;
    var quantity = request.body.quantity?request.body.quantity:1;

    let session_data = {
        success_url: full_url + '/stripe-process?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: full_url + '/cancel',
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
              currency: currency,
              product_data: {
                name: product_name,
              },
              unit_amount: amount * 100,
            },
            quantity: quantity,
        }],
        mode:'payment',
        metadata:{
            order_id: order_id
        }
    }
    stripe.checkout.sessions.create(
        session_data,
        (err, session) => {
            if (err) {
                response.send({ "error": err });
            } else if (session) {    
                response.send(
                    templateLib.getTemplate(stripe_public_key,session.id)
                );               
            } else {
                response.send({ "error": "Some other problem" })
            }
        }
    );
};

module.exports.process_checkout = function(request, response){
    var session_id = request.query.session_id;
    stripe.checkout.sessions.retrieve(
        session_id,
        (err, session) => {
            if (err) {
                response.redirect('/cancel');
            } else if (session) {
                response.redirect(`/success?order_id=${session.metadata.order_id}&amount=${parseFloat(session.amount_total/100)}&transaction_id=${session.payment_intent}`)
            } else {
                response.redirect('/cancel');
            }
        }
    );
};