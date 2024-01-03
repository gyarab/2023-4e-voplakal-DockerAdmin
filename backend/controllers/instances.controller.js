module.exports = {
    getAll: async (req, res) => {
        let i = instances;
        if (!i) i = [];
        res.send(i);
    },
    delete: async (req, res) => {
        console.log("delete:", req.body.ids);
        res.send({})
    }
};
let instances = [
    {
      id: '62234444',
      app_id: '123432341ščř',
      status: 'Up 3 days',
      image_id: '23452345',
      expiry_date: '2023-11-22',
      created_on: '2023-01-16',
      name: 'deh-martin.air345',
      client: 'pepa.novak@seznam.cz',
      limits: {
        cpu: 60,
        ram: 2000,
        swap: 444,
        disk: 46666,
      },
    },
    {
      id: '12234445',
      app_id: '123432341ščř',
      client: 'pepa.novak@seznam.cz',
      expiry_date: '2023-11-22',
      created_on: '2023-01-16',
      container_id: '2cea44557dcb',
      tag: 'latest',
      image_id: '23452345',
      status: 'Up 3 days',
      name: 'deh-martin.air345',
    },
    {
      id: '12234445',
      app_id: '123432čř',
      client: 'pepa.novak@seznam.cz',
      created_on: '2023-01-16',
      expiry_date: '2023-11-22',
      container_id: '2cea44557dcb',
      tag: 'latest',
      image_id: '23452345',
      status: 'Up 3 days',
      name: 'deh-martin.air345',
    },
    {
      id: '12234445',
      app_id: '123432čř',
      container_id: '2cea44557dcb',
      client: 'pepa.novak@seznam.cz',
      expiry_date: '2023-11-22',
      tag: 'latest',
      image_id: '23452345',
      created_on: '2023-01-16',
      status: 'Up 3 days',
      name: 'deh-martin.air345',
    },
  ]