<template>
    <Navbar/>
    <div class="pt-22.25 p-6 grid gap-6">
        <div class="flex justify-between items-center px-4">
            <div class="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    class="hidden rounded-full border-primary/40 text-primary shadow-sm shadow-primary/20 transition hover:shadow-lg sm:flex"
                    @click="handleDashboard"
                >
                    <ChevronLeft 
                      class="size-4"
                    />
                </Button>
                <span class="text-2xl font-semibold">Anime</span>
            </div>
            <Button
                variant="outline"
                size="icon"
                class="hidden rounded-full border-primary/40 text-primary shadow-sm shadow-primary/20 transition hover:shadow-lg sm:flex"
                @click="loadFilm"
            >
                <RefreshCw
                  class="size-4"
                />
            </Button>
        </div>
        <Card class="border-primary/40">
            <CardContent class="grid sm:grid-cols-3 xl:grid-cols-6 gap-4 text-center">
                <Card @click="handleFilm" v-for="items in anime" :key="items.id" class="border-primary/40 hover:bg-primary/20 p-0 group">
                    <CardContent class="p-0">
                        <div class="flex flex-col">
                            <div class="relative">
                                <img 
                                    :src="items.image"
                                    @error="handleImageError"
                                    class="rounded-xl aspect-ratio"
                                />
                                <div class="hidden group-hover:block absolute top-0 right-0 p-1 bg-card rounded-bl-xl rounded-tr-xl">
                                    <Trash
                                        @click="deleteFilmData(items.id)"
                                        class="transition sm:flex hover:text-primary"
                                    />
                                </div>
                                <span class="select-none absolute bottom-0 left-0 bg-card rounded-tr-xl pr-2 pl-1">{{ items.episode }}</span>
                                <div class="flex gap-1 absolute bottom-0 right-0 bg-card rounded-tl-xl pl-2 pr-1 items-center">
                                    <Plus
                                        @click="addFilmEpidose(items)"
                                        class="transition sm:flex hover:text-primary "
                                    />
                                    <div 
                                        class="border-muted-foreground border-l-1 h-4"
                                    />
                                    <Minus
                                        @click="subtractFilmEpidose(items)"
                                        class="transition sm:flex hover:text-primary "
                                    />
                                </div>
                            </div>
                            <Label class="flex justify-center xl:pt-2 xl:pb-3 sm:pt-5 sm:pb-7 pt-6 pb-6">{{ items.name }}</Label>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import { deleteFilm, getAllAnime, updateFilm } from '@/fetch';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { RefreshCw, ChevronLeft, Plus, Minus, Trash } from 'lucide-vue-next';
import Label from '@/components/ui/label/Label.vue';

const anime = ref('')

const handleDashboard = () => {
    router.push('/')
}

const handleFilm = () => {

}

const deleteFilmData = async (id) => {
    try {
        await deleteFilm(id)
        toast("Success", {
        description: "Berhasil menghapus judul film",
        class: "bg-chart-2 p-4 text-white rounded-xl",
        })
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        })
    }finally{
        loadFilm()
    }
}

const addFilmEpidose = async (data) => {
    const item = {
        episode: data.episode + 1
    }
    try {
        await updateFilm(data.id, item)
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        })
    }finally{
        loadFilm()
    }
}

const subtractFilmEpidose = async (data) => {
    const item = {
        episode: data.episode - 1
    }
    try {
        await updateFilm(data.id, item)
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        })
    }finally{
        loadFilm()
    }
}

const handleImageError = (event) => {
    event.target.src = '/defaulf_picture.png'
}

const loadFilm = async () => {
    try {
        const data = await getAllAnime()
        anime.value = data ? data.data : []
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        });
        anime.value = []
    }
}

onMounted(loadFilm)

</script>