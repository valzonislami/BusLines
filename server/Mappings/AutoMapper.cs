// File: Mappings/AutoMapperProfile.cs

using AutoMapper;
using server.DTOs;
using server.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace server.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email)) // Map Email field directly
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id)) // Map Id field directly
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName)) // Map FirstName field directly
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName)); // Map LastName field directly
        }
    }
}
