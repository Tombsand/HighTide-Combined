<template>
    <Navbar />
    <div class="pt-16.25 flex justify-center">
        <div class="w-2/3 pt-7 grid gap-4">
            <span class="text-2xl font-semibold">Manage Film</span>
            <Card>
                <CardContent class="grid gap-2">
                    <div class="grid gap-2">
                        <Label>Nama Film</Label>
                        <Input v-model="nama"></Input>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <div class="grid gap-2">
                            <Label>Link</Label>
                            <Input v-model="link"></Input>
                        </div>
                        <div class="grid gap-2">
                            <Label>Episode</Label>
                            <Input v-model="episode" type="number"></Input>
                        </div>
                        <div class="grid gap-2">
                            <Label>Tipe Film</Label>
                            <Select v-model="tipeFilm">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe Film"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Donghua">Donghua</SelectItem>
                                    <SelectItem value="Anime">Anime</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="grid gap-4 md:grid-cols-[2fr_1fr]">
                        <div class="space-y-2">
                            <Label for="image">Pilih Gambar Film</Label>
                            <div class="border-dashed border-3 rounded-xl h-33 relative flex items-center justify-center">
                                <ArchiveRestore class="pointer-events-none absolute top-26px size-20 opacity-70"/>
                                <Input
                                ref="image"
                                id="image"
                                type="file"
                                accept="image/*"
                                @change="handleImageChange"
                                class="h-30 opacity-0"
                                />
                            </div>
                        </div>
                        <div
                        class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30 p-4"
                        >
                        <img
                            :src="currentPreview"
                            alt="Pratinjau gambar menu"
                            class="h-32 w-24 rounded-md object-cover"
                            @error="handleImageError"
                        />
                        <p class="text-xs text-muted-foreground">Pratinjau gambar</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter class="flex gap-2">
                    <Button @click="cancel">Cancel</Button>
                    <Button @click="handleNewFilm">Submit</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import { getDetailFilm, updateFilm } from '@/fetch';
import router from '@/router';
import { ArchiveRestore } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

const preview = ref('')
const route = useRoute()
const filmDetail = ref()
const imageFile = ref(null)
const imageBase64 = ref('')
const nama = ref('')
const link = ref('')
const episode = ref('')
const tipeFilm = ref('')

const handleNewFilm = async() => {
    const filmData = {
        name: nama.value,
        episode: episode.value,
        link: link.value,
        image: imageBase64.value,
        type: tipeFilm.value,
        active: true
    }

    try {
        await updateFilm(route.query.id ,filmData)
        toast("Success", {
        description: "Berhasil mengganti detail film",
        class: "bg-chart-2 p-4 text-white rounded-xl",
        })
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        })
    }

    router.push('/manage-film')
}

const currentPreview = computed(
  () => imageBase64.value || '/defaulf_picture.png'
)

const handleImageError = (event) => {
  event.target.src = '/defaulf_picture.png'
}

const handleImageChange = (event) => {
  const [file] = event.target.files ?? []
  
  if (!file) {
    imageFile.value = null
    preview.value = ""
    return
  }

  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result ?? ""
    imageBase64.value = reader.result
  }
  reader.readAsDataURL(file)
}

const cancel = () => {
    router.push('/manage-film')
}

const loadFilm = async () => {
    try {
        const data = await getDetailFilm(route.query.id)
        filmDetail.value = data.data
    } catch (error) {
        toast("Error", {
        description: error.message ?? "Terjadi masalah",
        variant: "destructive",
        class: "bg-destructive-foreground p-4 text-white rounded-xl",
        });
    }

    if (!filmDetail.value) return

    nama.value = filmDetail.value.name
    link.value = filmDetail.value.link
    episode.value = filmDetail.value.episode
    tipeFilm.value = filmDetail.value.type
    imageBase64.value = filmDetail.value.image
}

onMounted(loadFilm)

</script>