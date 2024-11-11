import paths from "../utils/paths.js";
import ErrorManager from "./ErrorManager.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "carts.json";
    }

    async #findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));

        if (!cartFound) {
            throw new ErrorManager("Id de carrito no encontrado", 404);
        }
        return cartFound;
    }

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async createOne(data) {
        try {
            const { products } = data;
            // if (!products ) {
            //     throw new ErrorManager("Faltan datos del carrito", 400);
            // }

            const cart = {
                id: generateId(await this.getAll()),
                products: products || [],
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async addProduct(cid, pid, quantity) {
        try {
            const cart = await this.getById(cid);
            if (!cart) {
                throw new ErrorManager('Cart not found', 404);
            }
    
            const productIndex = cart.products.findIndex(p => p.product === pid);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: pid, quantity });
            }
    
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteById(id){
        try {
            const cartFound = await this.#findOneById(id);
            // if (cartFound.thumbnail) {
            //     await deleteFile(paths.images, Found.thumbnail);
            // }

            const index = this.#carts.findIndex((item) => item.id === Number(id));
            this.#carts.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}