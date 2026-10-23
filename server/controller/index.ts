import type { Context } from "hono";
import { prisma } from '../../prisma/client/index.js';

const errorMessage = (err: unknown) => err instanceof Error ? err.message : String(err)

const parseId = (c: Context) => {
    const id = Number(c.req.param('id'))
    return Number.isInteger(id) ? id : null
}

// Input form (type="number") ngirim string, kolom episode di DB Int.
const toInt = (value: unknown) => {
    if (value === undefined || value === null || value === '') return undefined
    const n = Number(value)
    return Number.isFinite(n) ? Math.trunc(n) : undefined
}

export const getFilm = async (c: Context) => {
    try{
        const data = await prisma.film.findMany({ orderBy: { id: 'asc' } })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 500)
    }
}

export const getDonghua = async (c: Context) => {
    try{
        const data = await prisma.film.findMany({
            where:{
                type: "Donghua"
            },
            orderBy: { id: 'asc' }
        })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 500)
    }
}

export const getAnime = async (c: Context) => {
    try{
        const data = await prisma.film.findMany({
            where: {
                type: "Anime"
            },
            orderBy: { id: 'asc' }
        })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 500)
    }
}

export const addFilm = async (c: Context) => {
    try{
        const body = await c.req.json()

        const name = body.name ?? '';
        const episode = toInt(body.episode) ?? 0;
        const link = body.link ?? '';
        const image = body.image ?? '';
        const type = body.type ?? '';
        const active = body.active ?? false;

        const data = await prisma.film.create({
            data: {
                name: name,
                episode: episode,
                link: link,
                image: image,
                type: type,
                active: active
            }
        })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 400)
    }
}

export const getDetailFilm = async(c: Context) => {
    try{
        const filmId = parseId(c)
        if(filmId === null){
            return c.json({ success: false, message: "Invalid id" }, 400)
        }

        const data = await prisma.film.findUnique({
            where: {
                id: filmId
            }
        })

        if(!data){
            return c.json({
                success: false,
                message: "Film Not Found"
            }, 404)
        }

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 500)
    }
}

export const updateFilm = async (c: Context) => {
    try{
        const filmId = parseId(c)
        if(filmId === null){
            return c.json({ success: false, message: "Invalid id" }, 400)
        }
        const body = await c.req.json()

        const data = await prisma.film.update({
            where: {
                id: filmId
            },
            data: {
                name: body.name,
                episode: toInt(body.episode),
                link: body.link,
                image: body.image,
                type: body.type,
                active: body.active
            }
        })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 400)
    }
}

export const deleteFilm = async (c: Context) => {
    try{
        const filmId = parseId(c)
        if(filmId === null){
            return c.json({ success: false, message: "Invalid id" }, 400)
        }

        const data = await prisma.film.delete({
            where: {
                id: filmId
            }
        })

        return c.json({
            success: true,
            message: "success",
            data: data
        }, 200)
    }catch(err){
        return c.json({
            success: false,
            message: errorMessage(err)
        }, 400)
    }
}
