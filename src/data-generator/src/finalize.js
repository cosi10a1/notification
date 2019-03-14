import { weightedBoolean } from './utils';

export default function(db) {
  // add settings
  db.settings = [
    {
      id: 1,
      configuration: {
        url: 'http://posters-galore.com/',
        mail: {
          sender: 'julio@posters-galore.com',
          transport: {
            service: 'fakemail',
            auth: {
              user: 'fake@mail.com',
              pass: 'f00b@r'
            }
          }
        },
        file_type_whiltelist: [
          'txt',
          'doc',
          'docx',
          'xls',
          'xlsx',
          'pdf',
          'png',
          'jpg'
        ]
      }
    }
  ];
}
