/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autentisering och användarhantering
 *   - name: Menu
 *     description: Produktmeny (admin-endpoints)
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logga in användare
 *     description: Returnerar JWT-token vid lyckad inloggning.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "hemligtLösenord123"
 *     responses:
 *       200:
 *         description: Inloggning lyckades, token returneras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Ogiltiga inloggningsuppgifter
 *       401:
 *         description: Autentisering misslyckades
 *
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registrera ny användare
 *     description: Skapar en ny användare.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: "hemligtLösenord123"
 *               name:
 *                 type: string
 *                 example: "Anna Andersson"
 *     responses:
 *       201:
 *         description: Användare skapad
 *       400:
 *         description: Saknade eller ogiltiga fält
 */

/**
 * @swagger
 * /api/menu:
 *   post:
 *     tags:
 *       - Menu
 *     summary: Lägg till ny produkt i menyn (admin)
 *     description: Skapar en ny produkt med titel, beskrivning och pris. `prodId` och `createdAt` sätts automatiskt av servern.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - desc
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Caffe Latte"
 *               desc:
 *                 type: string
 *                 example: "Espresso med varm mjölk och skum"
 *               price:
 *                 type: number
 *                 example: 35.0
 *     responses:
 *       201:
 *         description: Produkt skapad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     prodId:
 *                       type: string
 *                       example: "prod-12345"
 *                     title:
 *                       type: string
 *                       example: "Caffe Latte"
 *                     desc:
 *                       type: string
 *                       example: "Espresso med varm mjölk och skum"
 *                     price:
 *                       type: number
 *                       example: 35.0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Ogiltiga eller saknade fält
 *       401:
 *         description: Ingen token eller ogiltig token
 *       403:
 *         description: Endast admin får lägga till produkt
 *
 * /api/menu/{prodId}:
 *   put:
 *     tags:
 *       - Menu
 *     summary: Uppdatera befintlig produkt (admin)
 *     description: Uppdaterar titel, beskrivning eller pris på en produkt. Ett fält `modifiedAt` sätts automatiskt till aktuell tid.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Produktens unika ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ny Titel"
 *               desc:
 *                 type: string
 *                 example: "Ny beskrivning"
 *               price:
 *                 type: number
 *                 example: 40.0
 *     responses:
 *       200:
 *         description: Produkt uppdaterad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     prodId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     desc:
 *                       type: string
 *                     price:
 *                       type: number
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Ogiltig request body
 *       401:
 *         description: Ingen eller ogiltig token
 *       403:
 *         description: Endast admin får uppdatera produkt
 *       404:
 *         description: Produkten finns inte
 *
 * /api/menu/{prodId}:
 *   delete:
 *     tags:
 *       - Menu
 *     summary: Ta bort produkt (admin)
 *     description: Tar bort en produkt baserat på dess `prodId`. Returnerar fel om produkten inte finns.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Produktens unika ID
 *     responses:
 *       200:
 *         description: Produkt borttagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Produkten har tagits bort"
 *       401:
 *         description: Ingen eller ogiltig token
 *       403:
 *         description: Endast admin får ta bort produkt
 *       404:
 *         description: Produkten finns inte
 */

