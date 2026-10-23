<template>
    <Navbar />
    <div class="pt-24.25 p-6 items-center justify-center flex-col flex">
        <Card class="w-full max-w-6xl h-50 bg-gradient-to-br from-primary/10 via-background to-secondary/20 ansition-all duration-300">
            <CardContent class="flex flex-col">
                <span>Dashboard</span>
                <div class="flex flex-col font-serif text-4xl pt-1">
                    <span>Menyimpan data Film</span>
                    <span>dengan mudah dan cepat</span>
                </div>
                <div class="flex justify-between">
                    <div></div>
                    <div class="flex gap-2">
                        <Button @click="handleDonghua">Donghua</Button>
                        <Button @click="handleAnime">Anime</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div class="flex pt-5 p-2 gap-6 w-full max-w-6xl">
            <Card class="w-full p-4 h-[50vh] flex flex-col">
                <CardHeader class="text-2xl pt-2">
                    <div class="flex justify-between pr-5">
                        Film
                        <div class="flex gap-2">
                            <Button
                            variant="outline"
                            size="icon"
                            class="hidden border-primary/40 text-primary shadow-sm shadow-primary/20 transition hover:shadow-lg sm:flex"
                            @click="handleNewfilm"
                            >
                                <Plus class="size-4"/>
                            </Button>
                            <Button
                            variant="outline"
                            size="icon"
                            class="hidden border-primary/40 text-primary shadow-sm shadow-primary/20 transition hover:shadow-lg sm:flex"
                            @click="handleManageFilm"
                            >
                                <Settings class="size-4"/>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent class="flex-1 overflow-hidden">
                    <div class="h-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Nama Film</TableHead>
                                <TableHead>Episode</TableHead>
                                <TableHead>Tipe</TableHead>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-if="film.length" v-for="items in film" :key="items.id" class="items-center">
                                    <TableCell><img :src="items.image" @error="handleImageError" class="h-14"></TableCell>
                                    <TableCell>{{items.name}}</TableCell>
                                    <TableCell>{{items.episode}}</TableCell>
                                    <TableCell>{{items.type}}</TableCell>
                                </TableRow>
                                <TableRow v-else class="text-center">
                                    <TableCell colspan="4">Tidak ada data film baru, silahkan tambahkan data film baru.</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { getAllFilm } from '@/fetch';
import { Plus, Settings } from 'lucide-vue-next';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';

const film = ref('')

const handleDonghua = () => {
    router.push('/donghua')
}

const handleAnime = () => {
    router.push('/anime')
}

const handleNewfilm = () => {
    router.push('/add-film')
}

const handleManageFilm = () => {
    router.push('/manage-film')
}

const handleImageError = (event) => {
    event.target.src = '/defaulf_picture.png'
}

const loadFilm = async () => {
    try {
        const data = await getAllFilm()
        film.value = data ? data.data : []
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        });
        film.value = []
    }
}

onMounted(loadFilm)

</script>